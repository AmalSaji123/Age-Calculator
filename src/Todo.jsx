import React,{useState}from 'react'

function Todo() {

  const [todo,setTodo] = useState('')
  const [todos,setTodos] = useState([])
  const [complete,setComplete] = useState('')
  const [completed,setCompleted] = useState([])

  const AddTask=()=>{
    const newtodos = [...todos,todo]  
    setTodos(newtodos)
    setTodo("")
  } 

  const CompleteTask=(index)=>{
    const newtask = todos[index]
    
    setCompleted((prev)=>[...prev,newtask])

  }




  

  return (

    <div>
      <input type='text'
      placeholder='Enter the Task'
      value={todo}
      onChange={(e)=>{
        setTodo(e.target.value)
      }}/>
      <button className='text-' onClick={AddTask}>Add</button>
      <div>
        {todos.map((todo,index)=>{
          return(
            <div>
              <p className='text-2xl bg-red-100' key={index}>{todo}</p>
              <input 
              onClick={()=>{CompleteTask(index)}}
               type='checkbox'/>
            </div>
          )
        })}
      </div>

      <div>
        
        <h1>Completed Task</h1>
        {completed.map((item,index)=>{
          
          return(
            
            <div>
              
              <p key={index}>{item}</p>
            </div>
          )
        })}
      </div>
    </div>

  )
}

export default Todo
