import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();

app.use( bodyParser.json() );

app.post( '/events', async ( req, res ) =>{
  const { type, data } = req.body;
  
  if ( type === "Comment Created" ){
    const status = data.content.includes( 'orange' ) ? 'rejected' : 'approved';
    await axios.post("http://event-bus-srv:4005/events", {
      type: 'Comment Moderated', 
      data: {
        id: data.id,
        content : data.content,  
        postId: data.postId, 
        status  
      }
    })
  }
  
  res.send( {} );
});

const port = 4003;
app.listen( port, 
  ()=>console.log(`server running on port ${port}..`)
)