       // ** Redux Imports
       import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
    
      // ** Axios Imports
      import axios from 'axios'

     const initialData = () => {
       const item = window.sessionStorage.getItem('paramData') 
       //** Parse stored json or if none return initialValue
       return item ? JSON.parse(item) : {}
     }
     const initialTK = () => {
      const item = window.sessionStorage.getItem('tk')  
      //** Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : ''
     }

     const initialOutletDetails = () => {
      const item = window.sessionStorage.getItem('outletDetails')  
      //** Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : []
     }
    
     const initialOutletList = () => {
      const item = window.sessionStorage.getItem('outletList')  
      //** Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : []
     }

          export const getOrgDetails = createAsyncThunk('launch/getOrgDetails', async (urlKey) => {
                     
                const urlString = urlKey.replace(/ /g,'+')
                const response = await axios.post('https://link.lucidits.com/api-lucid/Beta/V1/LongUrl',
                     { 
                      urlKey:urlString,
                      username: "lucid@WebsiteShorturl",
                      password: "web@Redirect[lucid]",
                      requestIP: "",
                      userId: "" 
                     }
                     ).then((res)=> { 
                       if (res.data.isSuccessful === true) return res.data.longUrlInput
                     })
                     
                    return response 
                })
                
          export const getGuestAppToken = createAsyncThunk('launch/getGuestAppToken', async (obj) => {
                const res = await axios.get(`${process.env.REACT_APP_BASE_API_URL}LUCIDPOSIntegrationAPI/V1/GetGuestAppToken`,
                               {
                                params:{
                                    OrganizationId:obj.OrganizationId,
                                    PropertyId :obj.PropertyId,
                                    TokenKey :"A519618A-7218-4375-AC2B-34811ED6AD37"
                                  },
                                  // headers: { Authorization: `Bearer ${userData.lucidapiToken}`},
                                  "Content-Type": "application/json"
                                } 
                                 )  
                                 const token =  res.data.response.token
                                 return token
                                //, errorCode:  res.data.errorCode, message:res.data.message}   
                                }) 

             export const getOutletDetails = createAsyncThunk('launch/getOutletDetails', async (obj) => {
                const res = await axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetOutletDetails`, {
                 params:{
                   outletCode:obj.outletCode
                 },   // outletList.token should be used if multiple choices are available for property selection or use only guest api token
                 headers: { Authorization: `Bearer ${obj.tokenOption}`},
                  "Content-Type": "application/json"
                 }
              ).then((response) => {   
                return {outletDetails :response.data.response.outletDetails, errorCode: response.data.errorCode, message:response.data.message}
              })
                 return res 
             })
           
          export const getOutletList = createAsyncThunk('launch/getOutletList', async (obj) => {
            const res = await axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetOutletList`, {
                                         params:{
                                           PropertyId:obj.propertyId
                                         },
                                         headers: { Authorization: `Bearer ${obj.token}`},
                                          "Content-Type": "application/json"
                                         }
                                        ).then((response) => {  
                                        // return response.data.response 
                                         return {token: response.data.response.token, outletList :response.data.response.outletList, errorCode: response.data.errorCode, message:response.data.message}
                                        })
                                        return res
                                      })

      export const launchSlice = createSlice({
        name: 'launch',
          initialState: {
            paramData: initialData(),
            token:initialTK(),
            outletDetails: initialOutletDetails(),
            outletListData:initialOutletList(),
            viewPage:'',
            pageId:0
          },  
        reducers:{ 
          handleOutletList: (state, action) => {
              state.outletListData = action.payload 
              sessionStorage.setItem('outletList', JSON.stringify(action.payload)) 
              
            },
          handleLogout: state => {
            state.paramData = {} 
            // ** Remove user, accessToken & refreshToken from localStorage
            localStorage.removeItem('userData') 
          }, 
          handleViewPage: (state, action) => {
            state.viewPage = action.payload 
          },
          handlePageId: (state, action) => {
            state.pageId = action.payload
          }
          }, 
          extraReducers: builder => {
              builder
                .addCase(getOrgDetails.fulfilled, (state, action) => {
                  state.paramData = action.payload 
                 // sessionStorage.setItem('paramData', JSON.stringify(action.payload)) 
                 // state.bookmarks = action.payload.bookmarks
                }) 
                .addCase(getGuestAppToken.fulfilled, (state, action) => {
                  state.token = action.payload 
                //  sessionStorage.setItem('tk', JSON.stringify(action.payload)) 
                 // state.bookmarks = action.payload.bookmarks
                }).addCase(getOutletList.fulfilled, (state, action) => {
                  state.outletListData = action.payload
                  
                  sessionStorage.setItem('outletList', JSON.stringify(action.payload)) 
                 // state.bookmarks = action.payload.bookmarks
                }).addCase(getOutletDetails.fulfilled, (state, action) => {
                  state.outletDetails = action.payload 
                  sessionStorage.setItem('outletDetails', JSON.stringify(action.payload)) 
                 // state.bookmarks = action.payload.bookmarks
                }) 
        }
      })

export const { handleOutletList, handleLogout, handleViewPage, handlePageId  } = launchSlice.actions

export default launchSlice.reducer
