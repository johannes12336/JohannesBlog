console.log('HELLO YA CUNT')


document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick( e.target.dataset.like)
    }  
    else if (e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
})


function handleLikeClick (post){
    console.log(post)
    console.log(post._id)
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    document.querySelector('span data-like-count="<%= post._id %>"')
}




function handleReplyClick (post){
    const postB =post._id
    console.log(postB)
}