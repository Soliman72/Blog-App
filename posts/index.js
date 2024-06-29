import express from "express";
import { randomBytes } from "crypto";
import bodyParser from "body-parser";
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use(cors())

const posts = {};

// GET
app.get( "/posts", ( req, res ) =>
{
  res.status(200).send( posts );
} );

// create post
app.post( "/posts/create", async( req, res ) =>
{
  const id = randomBytes( 4 ).toString( "hex" );
  const { title } = req.body;
  posts[ id ] = {
    id, title
  };

  await axios.post( "http://event-bus-srv:4005/events", {
    type: "Post Created",
    data: {
      id , title
    }
  } )

  res.status( 201 ).send( posts[ id ] );
} );

app.post( "/events", ( req, res ) =>{
  console.log( "Event Recieved : " , req.body.type );
  res.send( {} );
})

const port = 4000;
app.listen( port,
  () =>
  {
    console.log('v100');
    console.log( `server running on port ${ port }` )
  } );