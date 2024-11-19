import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "register",
        method: "POST",
        body: newUser,
      }),
    }),
    loginUser: builder.mutation({
        query:(userPayload)=>({
           url: "login",
           method: 'POST',
           body: userPayload
        })
    })
  }),
});

export const { useCreateUserMutation , useLoginUserMutation} = api;
export default api;
