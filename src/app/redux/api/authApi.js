import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
   }),
  
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auths/login",
        method: "POST",
        body: credentials,
      }),
    }),

    addAdmin: builder.mutation({
      query: (credentials) => ({
        url: "/users/addAdmin",
        method: "POST",
        body: credentials,
      }),
    }),
  
  }),
  
});

export const { useLoginMutation,useAddAdminMutation } = authApi;