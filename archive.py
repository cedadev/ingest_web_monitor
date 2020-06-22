from graphviz import Digraph


g = Digraph('G', filename='cluster.gv')

# NOTE: the subgraph name needs to begin with 'cluster' (all lowercase)
#       so that Graphviz recognizes it as a special cluster subgraph

with g.subgraph(name='cluster_0') as c:
    c.attr(style='filled', color='lightgrey')
    c.node_attr.update(style='filled', color='white')
    c.edges([('a0', 'a1'), ('a1', 'a2'), ('a2', 'a3')])
    c.attr(label='process #1')

with g.subgraph(name='cluster_1') as c:
    c.attr(color='blue')
    c.node_attr['style'] = 'filled'
    c.edges([('b0', 'b1'), ('b1', 'b2'), ('b2', 'b3')])
    c.attr(label='process #2')

g.edge('start', 'a0')
g.edge('start', 'b0')
g.edge('a1', 'b3')
g.edge('b2', 'a3')
g.edge('a3', 'a0')
g.edge('a3', 'end')
g.edge('b3', 'end')

g.node('start', shape='Mdiamond')
g.node('end', shape='Msquare')

#g.view()


'''

digraph G {


  data_provider [shape=egg,style=filled,fillcolor=yellow];
 
  gws  [style=filled,shape=cylinder,fillcolor=gray];
  ds [shape=egg,style=filled,fillcolor=yellow];
  
    subgraph cluster_arrivals {
    label = "Arrivals";
    style=filled;
    color="#ccccff";    
    node [style=filled,fillcolor="blue"];
  arrivals;
  fileops;
  arrivals_disk  [style=filled,shape=cylinder,fillcolor=gray];   
    node [style=striped,shape=rectangle,fillcolor="red;0.2:red;0.2:red;0.2:red;0.2:red"];
  arrivals -> arrivals_disk [penwidth=8];
  fileops -> arrivals_disk;
  }
  
    subgraph cluster_es {
    label = "elastic search";
    style=filled;
    color="#ccffcc";    
    node [style=filled,fillcolor="blue"];
    haystack;
    fbi;
    node [style=striped,shape=rectangle,fillcolor="red;0.2:red;0.2:red;0.2:red;0.2:red"];
    fast_indexer_q;
    slow_indexer_q;
    fast_indexer_q -> fbi;
    slow_indexer_q -> fbi;
  }
  
  subgraph cluster_ingest {
    label = "Ingest";
    style=filled;
    color=lightgrey;    
    
   processing_disk  [style=filled,shape=cylinder,fillcolor=gray];
  ingest_control [style=filled,fillcolor="blue"];
  }

  ingest_control -> fileops;


  subgraph cluster_deposit {
      label = "Deposit server";
    style=filled;
    color=pink;  

  deposit [style=filled,fillcolor="blue"];
  archive   [style=filled,shape=cylinder,fillcolor=gray];
      deposit_rpc [style=striped,shape=rectangle,fillcolor="red;0.2:red;0.2:red;0.2:red;0.2:red"];
    deposit_log_x [style=striped,shape=rectangle,fillcolor="red;0.2:red;0.2:red;0.2:red;0.2:red"];
  }
  
  
      deposit_log_x -> fast_indexer_q;
    deposit_log_x -> slow_indexer_q;
  
  
  ingest_control -> deposit;
  processing_disk -> deposit [penwidth=8];
  gws -> deposit [penwidth=8];
  arrivals_disk -> deposit [penwidth=8];
  ds -> ingest_control;
  data_provider -> arrivals [penwidth=8];
  ds -> processing_disk [penwidth=8];
  data_provider -> gws [penwidth=8];
  
  ingest_control -> deposit_rpc;
  

  
  deposit -> archive [penwidth=8];
  
    subgraph cluster_access {
    label = "access";
    style=filled;
    color="#ffffcc";    
    node [style=filled,fillcolor="blue"];
    jasmin;
    ftp2;
    
    dap;
    data;
    catalogue;
    archive_site;
    archive_site -> catalogue;
    catalogue -> data;
    data -> dap;
  }


  user [shape=egg,style=filled,fillcolor=yellow];

  haystack -> catalogue;
  fbi -> data;

  archive -> jasmin  [penwidth=8];
  archive -> ftp2  [penwidth=8];
  archive -> dap  [penwidth=8];
  
  jasmin -> user [penwidth=8];
  ftp2 -> user [penwidth=8];
  dap -> user [penwidth=8];
  
  deposit -> deposit_log_x
  
  deposit_rpc -> deposit;
  
}

'''