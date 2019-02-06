/**
 * Created by sjp23 on 05/02/2019.
 */


// icons for states
state_icons = {"killed": "skull", "died": "bomb", "new": "asterisk", "do_not_run": "ban",
    "warn": "exclamation-triangle", "ok-errors": "exclamation-triangle", "fail": "bell", "cleanup": "broom",
    "re-running": "cog"};





function icongen(s) {
    var hash = 0, i, chr;
    if (s.length === 0) return hash;
    for (i = 0; i < s.length; i++) {
    chr   = s.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

//w += ' <span style="background-color: #ff0; color: #333"><i class="fas fa-user"></i> ' + log.user + '</span>';