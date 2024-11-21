import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      const parsedToken = token && JSON.parse(token);
      if (parsedToken) {
        headers.set("Authorization", `Bearer ${parsedToken}`);
      }
      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "register",
        method: "POST",
        body: newUser,
      }),
    }),
    loginUser: builder.mutation({
      query: (userPayload) => ({
        url: "login",
        method: "POST",
        body: userPayload,
      }),
    }),
    googleLogin: builder.mutation({
      query: (idToken) => ({
        url: "auth/google",
        method: "POST",
        body: idToken,
      }),
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (payload) => ({
        url: "forgot-password",
        method: "POST",
        body: payload,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: `reset-password/${token}`,
        method: "POST",
        body: { newPassword },
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGoogleLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = api;
export default api;
