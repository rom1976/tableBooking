import { useEffect, useState } from "react";
import { getOrgDetails, getGuestAppToken, handlePageId, handleLogout, handleParamData } from "../../redux/launch";
 
import { useSearchParams} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import axios from "axios";
import { handleBookingClear, handleLogin, handlePropertySelection } from "../../redux/tableBooking";

const useLaunch = () => {
    const dispatch = useDispatch()
    const launchData = useSelector(state => state.launch)
    const [searchParams] = useSearchParams();
    const [urlKey] = useState(searchParams.get("ukey"))
    const [OrganizationId, setOrganizationId] = useState(launchData.paramData.organizationId)
    const [PropertyId, setPropertyId] = useState(launchData.paramData.propertyId)
    const [propertyName, setPropertyName] = useState('')
    const [outletCode, setOutletCode] = useState('')
    const [outletName, setOutletName] = useState('')
    const [remarks, setRemarks] = useState('')  
    const [token, setToken] = useState(launchData.token) 
    const refUrl = useRef(null)
    const refToken = useRef(null)
    
                useEffect(() => {
                       if (!launchData.paramData.organizationId && !refUrl.current) { 
                                 console.log(launchData.paramData.organizationId) 
                              dispatch(getOrgDetails(urlKey))
                               refUrl.current = true
                               if (!urlKey) {
                                   dispatch(handlePageId(0))
                               } 
                            } else if (launchData.paramData.organizationId && !refUrl.current) { 
                                           
                                     const urlString = urlKey.replace(/ /g,'+')
                                           axios.post('https://link.lucidits.com/api-lucid/Beta/V1/LongUrl',
                                          { 
                                           urlKey:urlString,
                                           username: "lucid@WebsiteShorturl",
                                           password: "web@Redirect[lucid]",
                                           requestIP: "",
                                           userId: "" 
                                          }
                                          ).then((res)=> { 
                                            if (res.data.isSuccessful === true) {
                                                const paramDataTemp = res.data.longUrlInput
                                                   if (paramDataTemp.organizationId !== OrganizationId) { 
                                                    localStorage.clear()
                                                    sessionStorage.clear()
                                                     //   alert(paramDataTemp.organizationId, OrganizationId) 
                                                       console.log(paramDataTemp) 
                                                       return paramDataTemp
                                                   }
                                            } 
                                          }).then((res) => {
                                             if (res) {
                                                 console.log(res.organizationId, OrganizationId) 
                                              dispatch(handleParamData(res))
                                                  dispatch(getGuestAppToken({OrganizationId:res.organizationId, PropertyId:res.propertyId}))
                                                  console.log(res)  
                                                  refToken.current = true
                                                } else {
                                                  if (OrganizationId && !launchData.token && !refToken.current) { 
                                                      dispatch(getGuestAppToken({OrganizationId, PropertyId}))
                                                      refToken.current = true
                                                  } 
                                                }
                                          }) 
                                          refUrl.current = true  
                                }
                             
                    }, [launchData.paramData.organizationId])

                     useEffect(() => {
                             if (launchData) { 
                                  setOrganizationId(launchData.paramData.organizationId)
                                  setPropertyId(launchData.paramData.propertyId) 
                                  setPropertyName(launchData.paramData.propertyName)
                                  setOutletCode(launchData.paramData.outletCode)
                                  setOutletName(launchData.paramData.outletName)
                                  setRemarks(launchData.paramData.remarks)  
                              }  
                             setToken(launchData.token) 
                     }, [launchData.paramData])
 
           useEffect(() => { 
                 //https://dev.lucidits.com/LUCIDPOSIntegrationAPI/V1/GetGuestAppToken
                 //?OrganizationId=<<OrganizationId>>&PropertyId=<<PropertyId>>&TokenKey=<<TokenKey>> 
                 //if (OrganizationId && reDirect.current === false) { 
             //  if (OrganizationId && !launchData.token && !refToken.current) { 
             //     //  dispatch(getGuestAppToken({OrganizationId, PropertyId}))
             //       refToken.current = true
             //   } 
                
            }, [OrganizationId, PropertyId, launchData.token])
 
         return { propertyName,  outletCode, outletName, remarks, token}
  }

export default useLaunch

