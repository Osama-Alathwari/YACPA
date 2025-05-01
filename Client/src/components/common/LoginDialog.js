// // src/components/common/LoginDialog.js
// import React, { useState } from 'react';
// import { Dialog } from 'primereact/dialog';
// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';
// import { Password } from 'primereact/password';

// const LoginDialog = ({ visible, onHide }) => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');

//     const loginHeader = (
//         <div className="flex flex-col items-center">
//             <h2 className="text-xl font-bold">تسجيل الدخول</h2>
//         </div>
//     );

//     const loginFooter = (
//         <div className="flex justify-center">
//             <Button
//                 label="تسجيل الدخول"
//                 icon="pi pi-sign-in"
//                 className="w-full"
//             />
//         </div>
//     );

//     return (
//         <Dialog
//             header={loginHeader}
//             visible={visible}
//             style={{ width: '90%', maxWidth: '400px' }}
//             onHide={onHide}
//             footer={loginFooter}
//             rtl
//         >
//             <div className="flex flex-col gap-4 mt-2">
//                 <div className="p-float-label w-full">
//                     <InputText
//                         id="username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         className="w-full"
//                     />
//                     <label htmlFor="username">اسم المستخدم</label>
//                 </div>

//                 <div className="p-float-label w-full">
//                     <Password
//                         id="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         feedback={false}
//                         toggleMask
//                         className="w-full"
//                     />
//                     <label htmlFor="password">كلمة المرور</label>
//                 </div>

//                 <div className="flex justify-between items-center">
//                     <a href="#" className="text-blue-600 text-sm hover:underline">نسيت كلمة المرور؟</a>
//                 </div>
//             </div>
//         </Dialog>
//     );
// };

// export default LoginDialog;