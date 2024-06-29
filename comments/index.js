import express from 'express';
import bodyParser from 'body-parser';
import { randomBytes } from "crypto";
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use( bodyParser.json() );
app.use( cors() );

const commentsByPosts={}

app.get( "/posts/:id/comments", ( req, res ) =>{
  res.send( commentsByPosts[ req.params.id ] || [] );
} );

app.post( "/posts/:id/comments", async( req, res ) =>{
  const commentId = randomBytes( 4 ).toString( "hex" );
  const {content} = req.body;

  const comments = commentsByPosts[ req.params.id ] || [];
  comments.push( { id: commentId, content , status : 'pending' } );
  
  await axios.post( "http://event-bus-srv:4005/events", {
    type: "Comment Created",
    data: {
      id: commentId,
      content,
      postId: req.params.id, 
      status: 'pending'
    }
  } );
  
  commentsByPosts[ req.params.id ] = comments;

  res.status( 201 ).send( comments );
} );

app.post( "/events", async ( req, res ) =>{
  console.log( "Event Recieved : ", req.body.type );
  const { type, data } = req.body;
  
  if ( type === 'Comment Moderated' ){
    const { id, postId, status , content } = data;
    const comments = commentsByPosts[ postId ];
    const comment = comments.find( comment =>{
      return comment.id === id;
    } );
    
    comment.status = status;

    await axios.post( "http://event-bus-srv:4005/events", {
      type: 'Comment Updated', 
      data: {
        id,
        postId,
        status, 
        content 
      }
    });
  }
  res.send( {} );
})

const port = 4001;
app.listen( port,
  () => console.log( `server running on port ${ port }` ) );