 
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"

const useAPI = () => {
     const launchData = useSelector(state => state.launch)
     const [token, setToken] = useState(launchData.token) 
     const [optionsTitle, setOptionsTitle] = useState(null)
     const [optionsTelephoneCode, setOptionsTelephoneCode] = useState(null)
     const titleRef = useRef(false)
     const mobileCodeRef = useRef(false)

             useEffect(() => {
                   if (launchData.token) {
                    setToken(launchData.token) 
                   titleRef.current = true
                   mobileCodeRef.current = true
                   }
             }, [launchData.token])
 
      //                 //'https://dev.lucidits.com/LUCIDAPI/V1/GetTitleList'    
      //                  const getTitleList = () => {
      //           axios.get(`${process.env.REACT_APP_BASE_API_URL}LUCIDAPI/V1/GetTitleList`,
      //           { 
      //           headers: { Authorization: `Bearer ${token}`},
      //           "Content-Type": "application/json"
      //           } 
      //          ).then((response) => { 
      //          
      //          const list = response.data.response
      //          setOptionsTitle(() => list.titleList.map(title => ({value:title.titleId, label : title.titleName})))
      //         // console.log(response.data.response)
      //          }).catch(error => console.log(error))
      //          titleRef.current = false
      //        }
  
      //        useEffect(() => {  
      //         //GET 'https://dev.lucidits.com/LUCIDAPI/V1/GetMobileCountryCode'
      //               if (token) { 
      //                             getTitleList()
      //                           //toggleRef.current = false
      //                          //  getPropertyHandler()  
      //                           axios.get(`${process.env.REACT_APP_BASE_API_URL}LUCIDAPI/V1/GetMobileCountryCode`,
      //                          { 
      //                        headers: { Authorization: `Bearer ${token}`},
      //                        "Content-Type": "application/json"
      //                        } 
      //                       ).then((response) => { 
      //                       // setMobileCountryCodeData(response.data.response)
      //                          const list = response.data.response
      //                        setOptionsTelephoneCode(() => list.mobileCountryCodeList.map(code => ({value:code.countryCode, label : code.telephoneCode})))
      //                      // console.log(response.data.response)
      //                       }).catch(error => console.log(error)) 

      //                       mobileCodeRef.current = false
      //                   }
    
      //           }, [token])
 
   // return {optionsTitle, optionsTelephoneCode}
}

export default useAPI