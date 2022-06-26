import axios from "axios";
import { createContext, useEffect, useReducer, useState } from "react";



const ItemContext = createContext();

const Context =(props) =>{
    const[user, setUser] = useState(props.userid);

    const [tempstate,setTempstate] = useState({
        items:[],
         cart:[],
         categories:[]
 });

     const[category,setCategory] = useState('All');
     const[sortFilter,setSortFilter] = useState();
     const[sort,setSort] = useState('relevance');
     const[search,setSearch] = useState("");
     

     const[pelement, setPelement] = useState("");

     useEffect(()=>{
    
     async function addcart(){
               await fetch(`http://localhost:5000/add-cart`,{
            method:"post",
            body:JSON.stringify({category:pelement.element.category,
            description:pelement.element.description,
            id: pelement.element.id,
            image: pelement.element.image,
            price: pelement.element.price,
            rating:pelement.element.rating,
            title: pelement.element.title,
            userid:user, 
            qty:pelement.qty}),
            headers:{
                'Content-Type':'application/json'
            }
        });
    
    }
    

     async function updatecart(){
              await fetch(`http://localhost:5000/update-cart`,{
            method:"put",
            body:JSON.stringify({userid:user, id:pelement.uid, qty:pelement.qty}),
            headers:{
                'Content-Type':'application/json'
            }
        });
       
    }

    async function deletecart(){
                await fetch(`http://localhost:5000/delete-cart`,{
                method:"delete",
                body:JSON.stringify({userid:user, id:pelement.uid}),
                headers:{
                    'Content-Type':'application/json'
                }
            });
     };
     if(pelement.dstate==="add") addcart();
     else if(pelement.dstate==="remove") deletecart();
     else if(pelement.dstate==="change_qty") updatecart();

    },[pelement,user]);

    const reducer =(state,action) =>{


        switch (action.type) {
            case 'init':
             
            setSortFilter({
                items:action.payload.itemdata,
                cart:action.payload.cartdata,
                categories:["All",...action.payload.categorydata]
            })
            return sortFilter;
    
            case 'category':
                setCategory(action.payload);
                if(action.payload==='relevance')state = {...sortFilter};
                return state;

            case 'add':
                setSortFilter({...state,cart:[...state.cart,{...action.payload,qty:1}]});
                setPelement({...pelement,element:action.payload,qty:1,dstate:"add"});
                state = sortFilter;
                return state;

            case 'remove':
                setSortFilter({...state,cart:state.cart.filter(element=>element.id!==action.payload.id)});
                setPelement({...pelement,uid:action.payload.id,dstate:"remove"});
                state = sortFilter;
                return state;

            case 'change_qty':
                setSortFilter({...state,cart:state.cart.map(element=>
                    {
                        if(element.id!==action.payload.id)return element;
                        else return {...element,qty:action.payload.qty};
                    }
                   )});
                   setPelement({...pelement,uid:action.payload.id,qty:action.payload.qty,dstate:"change_qty"});
                   state = sortFilter;
                   return state;
            case 'sort' :
                setSort(action.payload);
                  return state;
            case 'search':
                setSearch(action.payload);
                return state;

                case 'rating' :
                     state = {
                            ...sortFilter,items:sortFilter.items.filter(element=>element.rating.rate>=action.payload)
                        }
                        return state;
            default:
                return state;
        }
    }

    useEffect(()=>{

          const initFetch = async () => {
            const req1 = await axios.get(`http://localhost:5000/products`)
            const req2 = await axios.get(`http://localhost:5000/categories`)
            let cart1 = await axios.get(`http://localhost:5000/cart/${user}`)
            dispatch({type: 'init', payload: {itemdata: req1.data,categorydata:req2.data,cartdata:cart1.data}})
        }
        
        initFetch()
    },[user]);

    

    const [state, dispatch] = useReducer(reducer,{
           items:[],
            cart:[],
            categories:[]
    });

    useEffect(()=>{
        const itemlist =state.items
        .filter(element=>(category==='All'?true:element.category===category))
        .filter(element=>element.title.toLowerCase().includes(search))

        itemlist.sort((a,b)=>{
             if(sort==="popularity") return a.rating.count>=b.rating.count?-1:1;
            else if(sort==="low_to_high")return a.price<=b.price?-1:1;
            else if(sort==="high_to_low") return a.price<=b.price?1:-1;
            else return a.id<=b.id?-1:1;
        })
        setTempstate({
            ...state,
            items:itemlist
        })
    },[category,state,sort,search])



    return(
       <ItemContext.Provider value={{tempstate,dispatch}}>
           {props.children}
       </ItemContext.Provider>
    );
}

export {ItemContext,Context};