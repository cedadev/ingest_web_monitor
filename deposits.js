/**
 * Created by sjp23 on 04/04/2019.
 */


var rabbit_host = '';
var rabbit_user = '';
var rabbit_password = '';
var rabbit_vhost =  'deposit';
var log_exchange = 'deposit_logs';


var amqp = require('amqplib/callback_api');

amqp.connect('amqp://' + rabbit_host, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = log_exchange;

    ch.assertExchange(ex, 'fanout', {durable: false});

    ch.assertQueue('', {exclusive: true}, function(err, q) {
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      ch.bindQueue(q.queue, ex, '');

      ch.consume(q.queue, function(msg) {
        if(msg.content) {
        console.log(" [x] %s", msg.content.toString());
    }
      }, {noAck: true});
    });
  });
});