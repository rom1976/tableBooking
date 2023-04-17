  // ** Redux Imports
  import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

  // ** Axios Imports
  import axios from 'axios'
  const initialPropertyData = () => {
    const item = window.localStorage.getItem('propertyData') 
    //** Parse stored json or if none return initialValue
    return item ? JSON.parse(item) : {}
  }
 
   export const getPropertyList = createAsyncThunk('propertyList/getPropertyList', async (token) => {
    const response = await  axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetPropertyList`, {
           headers: { Authorization: `Bearer ${token}`},
           "Content-Type": "application/json"
          }
        ).then(res => {
         
          return res.data.response
        })
    return response
  })
  
  export const propertySlice = createSlice({
         name: 'propertyList',
         initialState: {
           propertyData:initialPropertyData(),
           query: '',
           bookmarks: [],
           suggestions: []
         },
         reducers: {
           handleSearchQuery: (state, action) => {
             state.query = action.payload
           }
         },
         extraReducers: builder => {
           builder
             .addCase(getPropertyList.fulfilled, (state, action) => {
               state.propertyData = action.payload
              
               localStorage.setItem('propertyData', JSON.stringify(action.payload)) 
              // state.bookmarks = action.payload.bookmarks
             })
     //  .addCase(updateBookmarked.fulfilled, (state, action) => {
     //    let objectToUpdate 
     //    // ** find & update object
     //    state.suggestions.find(item => {
     //      if (item.id === action.payload) {
     //        item.isBookmarked = !item.isBookmarked
     //        objectToUpdate = item
     //      }
     //    })

          // ** Get index to add or remove bookmark from array
      //  const bookmarkIndex = state.bookmarks.findIndex(x => x.id === action.payload)

      //  if (bookmarkIndex === -1) {
      //    state.bookmarks.push(objectToUpdate)
      //  } else {
      //    state.bookmarks.splice(bookmarkIndex, 1)
      //  }
      //})
    }
  })

  export const { handleSearchQuery } = propertySlice.actions

  export default propertySlice.reducer
