const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click',deleteItem)
})

// Array.from(item).forEach((element)=>{
//     element.addEventListener('click',markComplete)
// })

// Array.from(itemCompleted).forEach((element)=>{
//     element.addEventListener('click',markUncomplete)
// })

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem',{
            method:'delete',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                'itemFromJS':itemText
                })
            })
            const data = await response.json()
            console.log(data)
            location.reload()
        }catch(err){
            console.log(err)
        }
    }



