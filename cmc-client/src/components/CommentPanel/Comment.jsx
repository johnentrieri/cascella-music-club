import './Comment.css'

export default function Comment({commentData}) {
  return(
    <div className="comment">
      <p>
        <b>{commentData.author} </b>
        <i>({commentData.created_on}) </i>
        <br />
        {commentData.comment}      
      </p>
    </div>
  )
}