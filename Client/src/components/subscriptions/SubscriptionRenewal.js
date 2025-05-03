// // src/components/subscriptions/SubscriptionRenewal.js
// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Card } from 'primereact/card';
// import { InputText } from 'primereact/inputtext';
// import { Dropdown } from 'primereact/dropdown';
// import { Calendar } from 'primereact/calendar';
// import { InputTextarea } from 'primereact/inputtextarea';
// import { InputNumber } from 'primereact/inputnumber';
// import { Button } from 'primereact/button';
// import { AutoComplete } from 'primereact/autocomplete';
// import { Divider } from 'primereact/divider';
// import { Toast } from 'primereact/toast';
// import { FileUpload } from 'primereact/fileupload';
// import { useLanguage } from '../../contexts/LanguageContext';

// const SubscriptionRenewal = () => {
//     const { t } = useTranslation();
//     const { isRtl } = useLanguage();
//     const toast = React.useRef(null);
    
//     // Form state
//     const [formData, setFormData] = useState({
//         memberId: '',
//         memberName: '',
//         paymentDate: null,
//         paymentMethod: null,
//         referenceNumber: '',
//         amount: 150, // Default renewal amount
//         notes: '',
//         attachment: null
//     });
    
//     // Search state
//     const [filteredMembers, setFilteredMembers] = useState([]);
//     const [selectedMember, setSelectedMember] = useState(null);
    
//     // Validation state
//     const [submitted, setSubmitted] = useState(false);
//     const [loading, setLoading] = useState(false);
    
//     // Mock members data for search
//     const membersData = [
//         { id: 'M1001', name: 'عبدالله سالم الهاشمي', business: 'شركة الأمل للمحاسبة', subscriptionEnd: '2025-04-28', status: 'active' },
//         { id: 'M1002', name: 'سارة محمد الغامدي', business: 'مكتب السارة للاستشارات', subscriptionEnd: '2025-04-25', status: 'active' },
//         { id: 'M1004', name: 'أحمد عبدالله البكري', business: 'شركة النور المالية', subscriptionEnd: '2026-04-20', status: 'active' },
//         { id: 'M1006', name: 'هاني سعيد العمودي', business: 'مؤسسة هاني للمراجعة', subscriptionEnd: '2025-07-22', status: 'active' },
//         { id: 'M1007', name: 'ليلى حسن الكندي', business: 'مكتب الكندي للمحاسبة', subscriptionEnd: '2025-09-15', status: 'active' }
//     ];
    
//     // Payment method options
//     const paymentMethods = [
//         { label: t('common.cash'), value: 'cash' },
//         { label: t('common.bankTransfer'), value: 'bank_transfer' },
//         { label: t('common.check'), value: 'check' }
//     ];
    
//     // Handle member search
//     const searchMember = (event) => {
//         let _filteredMembers;
        
//         if (!event.query.trim().length) {
//             _filteredMembers = [...membersData];
//         } else {
//             _filteredMembers = membersData.filter((member) => {
//                 return member.name.toLowerCase().includes(event.query.toLowerCase()) ||
//                     member.id.toLowerCase().includes(event.query.toLowerCase()) ||
//                     member.business.toLowerCase().includes(event.query.toLowerCase());
//             });
//         }
        
//         setFilteredMembers(_filteredMembers);
//     };
    
//     // Member autocomplete template
//     const memberItemTemplate = (member) => {
//         return (
//             <div className="flex items-start p-2">
//                 <div>
//                     <div className="font-bold">{member.name}</div>
//                     <div className="text-sm text-gray-500">{member.id} - {member.business}</div>
//                 </div>
//             </div>
//         );
//     };
    
//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevData => ({
//             ...prevData,
//             [name]: value
//         }));
//     };
    
//     // Handle dropdown changes
//     const handleDropdownChange = (e) => {
//         setFormData(prevData => ({
//             ...prevData,
//             paymentMethod: e.value
//         }));
//     };
    
//     // Handle date changes
//     const handleDateChange = (e) => {
//         setFormData(prevData => ({
//             ...prevData,
//             paymentDate: e.value
//         }));
//     };
    
//     // Handle member selection
//     const handleMemberSelect = (e) => {
//         setSelectedMember(e.value);
//         setFormData(prevData => ({
//             ...prevData,
//             memberId: e.value.id,
//             memberName: e.value.name
//         }));
        
//         // Calculate new subscription end date - 1 year from current subscription end
//         const currentEnd = new Date(e.value.subscriptionEnd);
//         const newEnd = new Date(currentEnd);
//         newEnd.setFullYear(currentEnd.getFullYear() + 1);
        
//         // Display member details in a toast
//         toast.current.show({
//             severity: 'info',
//             summary: t('dashboard.subscriptions.memberSelected'),
//             detail: t('dashboard.subscriptions.currentEndDate') + ': ' + e.value.subscriptionEnd,
//             life: 5000
//         });
//     };
    
//     // Handle amount changes
//     const handleAmountChange = (e) => {
//         setFormData(prevData => ({
//             ...prevData,
//             amount: e.value
//         }));
//     };
    
//     // Handle file upload
//     const handleFileUpload = (e) => {
//         setFormData(prevData => ({
//             ...prevData,
//             attachment: e.files[0]
//         }));
        
//         toast.current.show({
//             severity: 'success',
//             summary: t('common.fileUploaded'),
//             detail: e.files[0].name,
//             life: 3000
//         });
//     };
    
//     // Form validation
//     const validateForm = () => {
//         return formData.memberId.trim() !== '' &&
//             formData.paymentDate !== null &&
//             formData.paymentMethod !== null &&
//             formData.referenceNumber.trim() !== '' &&
//             formData.amount > 0;
//     };
    
//     // Handle form submission
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setSubmitted(true);
        
//         if (validateForm()) {
//             setLoading(true);
            
//             // Simulate API call
//             setTimeout(() => {
//                 console.log('Form data:', formData);
                
//                 // Show success message
//                 toast.current.show({
//                     severity: 'success',
//                     summary: t('dashboard.subscriptions.renewalSuccess'),
//                     detail: t('dashboard.subscriptions.renewalSuccessDetail'),
//                     life: 5000
//                 });
                
//                 // Reset form
//                 setFormData({
//                     memberId: '',
//                     memberName