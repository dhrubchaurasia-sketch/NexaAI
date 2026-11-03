import "./Sidebar.css";
import logo from "./assets/logo.png";
import { useContext,useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";
function Sidebar(){
  const {allThreads,setAllThreads,currThreadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats} = useContext(MyContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const getAllThreads = async() =>{
    try{
      const response = await fetch(`${API_URL}/api/threads`);
      const res = await response.json();
      const filteredData = res.map(thread =>({
        threadId:thread.threadId,
        title:thread.title
      }));
      // console.log(filteredData);
      setAllThreads(filteredData);
    }catch(err){
      console.log(err);
    }

  };
  useEffect(()=>{
    getAllThreads();
  },[])
   
  const createNewChat = ()=>{
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  }

  const changeThread = async (newThreadId)=>{
    setCurrThreadId(newThreadId);
    try{
      const response=await fetch(`${API_URL}/api/thread/${newThreadId}`);
      const res= await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    }catch(err){
      console.log(err)
    }

  }

  const deleteThread = async (threadId) =>{
    try{
      const response = await fetch(`${API_URL}/api/thread/${threadId}`,{method:"DELETE"});
      const res = await  response.json();
      console.log(res);

      // Updated Threads re-render
      setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
      if(threadId ===currThreadId){
        createNewChat();
      }
    }catch(err){
      console.log(err);
    }
  }

    return(
      <section className ="sidebar">
      
      <button onClick={createNewChat}>
        <img src={logo} alt="gpt logo" className="logo"></img>
       <span><i className="fa-solid fa-pen-to-square"></i></span> 
      </button>

     
      <ul className = "history">
        {
          allThreads?.map((thread,idx)=>(
            <li key={idx}
             onClick = {(e) =>changeThread(thread.threadId)}
             className = {thread.threadId === currThreadId ? "highlighted" : ""}
             >{thread.title}
             <i className="fa-solid fa-trash-can"
               onClick = {(e)=>{
                e.stopPropagation();// Stop Event Bubbling
                deleteThread(thread.threadId);
               }}
             
             ></i>
            </li>
          ))
        }
      </ul>
    
      <div className="sign">
        <p>By Dhrub Chaurasia &hearts;</p>
      </div>
      </section>
    )
}

export default Sidebar;