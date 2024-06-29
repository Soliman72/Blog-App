import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use( bodyParser.json() );
app.use( cors() );

const posts = {};

const handelEvent = (type , data) =>{
  if ( type === 'Post Created' ){
    const { id, title } = data; 
    posts[ id ] = { id, title , comments : [] };
  }
  
  if ( type === 'Comment Created' ){
    const { id, content, postId , status } = data;
    const post = posts[ postId ];
    post.comments.push( { id, content , status } );
  }

  if ( type === 'Comment Updated' ){
    const { id, postId, status, content } = data;

    const post = posts[ postId ];
    const comment = post.comments.find( comment =>{
      return comment.id === id;
    } )
    
    comment.status = status;
    comment.content = content;
  }
}

app.get( '/posts', ( req, res ) =>{
  res.send( posts );
});

app.post( "/events", ( req, res ) =>{
  const { type, data } = req.body;
  
  handelEvent( type, data );
  
  res.send( {} );
});

const port = 4002;
app.listen( port , async () =>{
    console.log( `server running on port ${ port }` )
  
  try {
    const res = await axios.get( "http://event-bus-srv:4005/events" );
    
    for ( let event of res.data ){
      console.log( "Processing event : ", event.type );
      handelEvent(event.type , event.data)
    }
  } catch (error) {
    console.log(error.message);
  }
  
  } );