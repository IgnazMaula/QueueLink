/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface Props {
    user: any;
    followers: any[];
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FollowersModal: React.FC<Props> = ({ user, followers, open, setOpen }) => {
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as='div' className='fixed z-10 inset-0 overflow-y-auto' onClose={setOpen}>
                <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                        enterTo='opacity-100 translate-y-0 sm:scale-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                        leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                    >
                        <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6'>
                            <div>
                                <div className='mt-2'>
                                    <div className='min-w-0 flex-auto px-5'>
                                        <p className='text-lg font-semibold leading-6 text-gray-900'>
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className='mt-1 truncate text-lg leading-5 text-gray-400'>{user.refCode}</p>
                                    </div>
                                    <Dialog.Title as='h3' className='mt-5 text-md text-center leading-6 font-medium text-gray-900'>
                                        List of Followers
                                    </Dialog.Title>
                                    <div className='mt-5'>
                                        {followers.length > 0 ? (
                                            <ul role='list' className='divide-y divide-gray-100'>
                                                {followers.map((u) => (
                                                    <li key={u.id} className='flex justify-between gap-x-6 p-5'>
                                                        <div className='flex gap-x-4'>
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
                                        ) : (
                                            <p className='text-gray-400 text-center'>This user does not have follower</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='mt-5 sm:mt-6'>
                                <button
                                    type='button'
                                    className='inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm'
                                    onClick={() => setOpen(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default FollowersModal;
