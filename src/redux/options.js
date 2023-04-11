       // ** Redux Imports
       import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
    
      // ** Axios Imports
      import axios from 'axios'

     const initialTitle = () => {
       const item = window.sessionStorage.getItem('optionsTitle') 
       //** Parse stored json or if none return initialValue
       return item ? JSON.parse(item) : {}
     }

     const initialMobile = () => {
        const item = window.sessionStorage.getItem('optionsMobileCode') 
        //** Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : {}
      }

      export const getTitleList = createAsyncThunk('options/getTitleList', async (token) => { 
        const res =  axios.get(`${process.env.REACT_APP_BASE_API_URL}LUCIDAPI/V1/GetTitleList`,
               { 
               headers: { Authorization: `Bearer ${token}`},
               "Content-Type": "application/json"
               } 
              ).then((response) => { 
              
              const list = response.data.response
                return  list.titleList.map(title => ({value:title.titleId, label : title.titleName}))
              console.log(response.data.response)
              }) 
              return res
            }  
            )

        export const getMobileCountryCode  =  createAsyncThunk('options/getMobileCountryCode', async (token) => { 
                    const mobileOption = axios.get(`${process.env.REACT_APP_BASE_API_URL}LUCIDAPI/V1/GetMobileCountryCode`,
                          { 
                        headers: { Authorization: `Bearer ${token}`},
                        "Content-Type": "application/json"
                        } 
                       ).then((response) => { 
                       // setMobileCountryCodeData(response.data.response)
                          const list = response.data.response
                       return list.mobileCountryCodeList.map(code => ({value:code.countryCode, label : code.telephoneCode}))
                       console.log(response.data.response)
                       }).catch(error => console.log(error)) 
                           
                       return mobileOption
                    }  
                  )

                  export const optionsSlice = createSlice({
                    name: 'options',
                    initialState: {  
                      optionsTitle: initialTitle(),
                      optionsMobileCode:initialMobile(), 
                    },  
                    reducers:{  
                      }, 
                      extraReducers: builder => {
                          builder
                            .addCase(getTitleList.fulfilled, (state, action) => {
                              state.optionsTitle = action.payload 
                              sessionStorage.setItem('optionsTitle', JSON.stringify(action.payload)) 
                             // state.bookmarks = action.payload.bookmarks
                            }) 
                            .addCase(getMobileCountryCode.fulfilled, (state, action) => {
                              state.optionsMobileCode = action.payload 
                             sessionStorage.setItem('optionsMobileCode', JSON.stringify(action.payload)) 
                             // state.bookmarks = action.payload.bookmarks
                            })
                    }
                  })
             
            export default optionsSlice.reducer