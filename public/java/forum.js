console.log('HELLO YA CUNT')


document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick( e.target.dataset.like)
    }  
    else if (e.target.dataset.reply){
        console.log(e.target)
        handleReplyClick(e.target.dataset.reply)
    }
    else if (e.target.dataset.deletes){
        handleDeleteClick(e.target.dataset.deletes)
    }
    else if (e.target.dataset.repost){
        handleRepostClick(e.target.dataset.repost)
    }
})


async function handleLikeClick (postId){

    try {
        console.log("clicked like")

        const toBeLiked = document.getElementById(`like-${postId}`)
        toBeLiked.classList.toggle("liked")

        const response = await fetch(`/forum/like/${postId}`)
        
    } catch (error) {
        console.error(error)
    }
    

}

function handleRepostClick (postId){
    const repostTarget = document.getElementById(`repost-${postId}`)
    repostTarget.classList.toggle("reposted")


}



async function handleDeleteClick (postId){
    console.log(postId)
    const response = await fetch(`/forum/delete/${postId}`)
    const root = document.documentElement
    root.innerHTML = await response.text()

    
}

