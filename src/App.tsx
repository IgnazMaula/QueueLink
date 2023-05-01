import { FormEvent, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import FollowersModal from './components/FollowersModal';
import SuccessModal from './components/SuccessModal';
import ErrorModal from './components/ErrorModal';

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// User class
interface User {
    email: string;
    firstName: string;
    lastName: string;
    refCode: string;
    followers: number;
    parentId?: any;
}

function App() {
    // States for fetching data
    const [refetch, setRefetch] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    // States for create new user
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [refCode, setRefCode] = useState('');
    // States for Modals
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successModal, setSuccessModal] = useState(false);
    const [newRefCode, setNewRefCode] = useState('');
    const [followersModal, setFollowersModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [followersList, setFollowersList] = useState<any[]>([]);

    // Retrieve all users data
    useEffect(() => {
        const getAllUsers = async () => {
            const { data, error } = await supabase.from('users').select('*').order('followers', { ascending: false }).order('created_at');

            if (error) {
                setError(true);
                setErrorMessage(error.message);
            }
            if (data) {
                setError(false);
                setUsers(data);
            }
        };
        getAllUsers();
    }, [refetch]);

    // Get User by Id
    const getUserById = async (userId: number) => {
        const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();

        if (error) {
            setError(true);
            setErrorMessage(error.message);
        }
        if (data) {
            return data;
        }
    };

    // Add new User to Queue
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setRefetch(true);

        let parentId = null;

        if (refCode.length == 6) {
            parentId = await getParentUserIdByRefCode();
        }

        const newUser: User = { email, firstName, lastName, refCode: generateCode(), followers: 0, parentId };
        const { error } = await supabase.from('users').insert([newUser]);

        if (error) {
            setError(true);
            setErrorMessage(error.message);
        }

        if (parentId != null) {
            await updateUsersFollower(parentId);
        }

        setNewRefCode(newUser.refCode);
        setSuccessModal(true);
        setRefetch(false);
    };

    // Find Parent Id from Referral Code
    const getParentUserIdByRefCode = async () => {
        const { data, error } = await supabase.from('users').select('*').eq('refCode', refCode).single();

        if (data) {
            return data.id;
        }
        if (error) {
            setError(true);
            setErrorMessage(error.message);
        }
    };

    // Get Current follower of the selected user
    const getCurrentFollowerNumber = async (userId: number) => {
        const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();

        if (data) {
            return data.followers;
        }
        if (error) {
            setError(true);
            setErrorMessage(error.message);
        }
    };

    // Update User's following when new User registerred with referral code
    const updateUsersFollower = async (userId: number) => {
        let currentFollowers = await getCurrentFollowerNumber(userId);

        const { error } = await supabase
            .from('users')
            .update({ followers: (currentFollowers += 1) })
            .eq('id', userId);

        if (error) {
            setError(true);
            setErrorMessage(error.message);
        }
    };

    // Generate Referral code for new User
    const generateCode = () => {
        let code = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const codeLength = 6;

        for (let i = 0; i < codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        return code;
    };

    // Handle and populate followers modal
    const followersModalHandler = async (id: number) => {
        // Fetching the selected user's data
        const selectuser = await getUserById(id);
        setSelectedUser(selectuser);

        // Fetching the selected user's followers
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('followers', { ascending: false })
            .order('created_at')
            .eq('parentId', id);

        if (data) {
            setFollowersList(data);
        }
        if (error) {
            setError(true);
            setErrorMessage(error.message);
        }
        setFollowersModal(true);
    };

    return (
        <>
            {error && <ErrorModal message={errorMessage} open={error} setOpen={setError} />}
            {successModal && <SuccessModal email={email} refCode={newRefCode} open={successModal} setOpen={setSuccessModal} />}
            {followersModal && <FollowersModal user={selectedUser} followers={followersList} open={followersModal} setOpen={setFollowersModal} />}
            <h1>
                <span className='text-blue-500'>Queue</span>Link<span className='text-blue-500'>.</span>
            </h1>

            {/* Add User Form */}
            <div className='bg-white dark:bg-gray-900'>
                <div className='mx-auto py-10'>
                    <h2 className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>Add New Email</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='grid gap-4 sm:grid-cols-2 sm:gap-6'>
                            {/* First Name */}
                            <div className='w-full'>
                                <label htmlFor='firstName' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                                    First Name <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    name='firstName'
                                    id='firstName'
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    placeholder='John'
                                    required
                                />
                            </div>
                            {/* Last Name */}
                            <div className='w-full'>
                                <label htmlFor='lastName' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                                    Last Name
                                </label>
                                <input
                                    type='text'
                                    name='lastName'
                                    id='lastName'
                                    onChange={(e) => setLastName(e.target.value)}
                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    placeholder='Doe'
                                />
                            </div>
                            {/* Email */}
                            <div className='w-full'>
                                <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                                    Email <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='email'
                                    name='email'
                                    id='email'
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    placeholder='john.doe@email.com'
                                    required
                                />
                            </div>
                            {/* Ref Code */}
                            <div className='w-full'>
                                <label htmlFor='ref' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                                    Referral Code
                                </label>
                                <input
                                    type='text'
                                    name='ref'
                                    id='ref'
                                    onChange={(e) => setRefCode(e.target.value)}
                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    placeholder='ABC123'
                                />
                            </div>
                        </div>
                        <button
                            type='submit'
                            className='inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800'
                        >
                            Add to Queue
                        </button>
                    </form>
                </div>
            </div>

            {/* Queue List */}
            <h2 className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>Queue List</h2>
            <ul role='list' className='divide-y divide-gray-100'>
                {users.map((u, i) => (
                    <li
                        key={u.id}
                        onClick={() => followersModalHandler(u.id)}
                        className='flex justify-between gap-x-6 p-5 hover:bg-slate-200 hover:cursor-pointer'
                    >
                        <div className='flex gap-x-4'>
                            <h2 className='w-20'>#{i + 1}</h2>
                            <div className='relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-blue-500 rounded-full dark:bg-blue-600'>
                                <span className='font-medium text-white dark:text-gray-300'>
                                    {u.firstName.charAt(0).toUpperCase()}
                                    {u.lastName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className='min-w-0 flex-auto'>
                                <p className='text-sm font-semibold leading-6 text-gray-900'>
                                    {u.firstName} {u.lastName}
                                </p>
                                <p className='mt-1 truncate text-xs leading-5 text-gray-500'>{u.email}</p>
                            </div>
                        </div>
                        <div className='hidden sm:flex sm:flex-col sm:items-end'>
                            <p className='text-sm leading-6 text-gray-900'>Ref: {u.refCode}</p>
                            <p className='mt-1 text-xs leading-5 text-cyan-500'>{u.followers} Follower(s)</p>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default App;
