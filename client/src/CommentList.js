import React from 'react';

const CommentList = ({comments}) =>{
  let content;
  
  const renderedComments = comments.map( ( comment ) =>
  {

    if ( comment.status === 'approved' )
      content = comment.content;

    if ( comment.status === 'pending' )
      content = 'this conmment is awaiting moderation';

    if ( comment.status === 'rejected' )
      content = 'this comment has been rejected';

    return <li key={ comment.id }>{content}</li>
  })

  return <ul> {renderedComments} </ul>
};

export default CommentList;