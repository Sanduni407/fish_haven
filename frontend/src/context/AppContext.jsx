import { createContext, useEffect, useState } from "react";


export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    const[token,setToken] = useState("")

    useEffect(() => {
        async function loadData() {
    
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
            }
        }
    
        loadData();
    }, []);

    const value = {

        token,
        setToken
        
    }

    return(
       <AppContext.Provider value={value}>
        {props.children} 
       </AppContext.Provider>
    )
}