import { useEffect, useState } from "react";
import { getOrgDetails, getGuestAppToken, handlePageId } from "../../redux/launch";
 
import { useSearchParams} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";

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
    const [outletList, setOutletList] = useState(launchData.outletList)
    const refUrl = useRef(null)
    const refToken = useRef(null)
    
                useEffect(() => {
                       if (!launchData.paramData.organizationId && !refUrl.current) { 
                              dispatch(getOrgDetails(urlKey))
                               refUrl.current = true
                               if (!urlKey) {
                                   dispatch(handlePageId(0))
                               } 
                            } 
                            console.log(launchData.paramData.organizationId) 

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
               if (OrganizationId && !launchData.token && !refToken.current) { 
                  dispatch(getGuestAppToken({OrganizationId, PropertyId}))
                  refToken.current = true
                } 
                
            }, [OrganizationId, PropertyId, launchData.token])
 
         return {outletList, propertyName,  outletCode, outletName, remarks, token}
  }

export default useLaunch

