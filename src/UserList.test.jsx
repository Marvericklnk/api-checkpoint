import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import UserList from './UserList.jsx';
vi.mock('axios', () => ({default:{get:vi.fn(),isCancel:vi.fn(()=>false)}}));
const users=[{id:1,name:'Leanne Graham',email:'leanne@example.com',company:{name:'Example Company'},address:{street:'Main Street',suite:'Apt 1',city:'Lagos',zipcode:'100001'},phone:'12345',website:'example.com'},{id:2,name:'Ervin Howell',email:'ervin@example.com',company:{name:'Second Company'},address:{city:'Abuja'},phone:'67890',website:'second.com'}];
beforeEach(()=>vi.clearAllMocks());afterEach(cleanup);
test('shows loading until Axios resolves then maps user fields',async()=>{
 let resolve;axios.get.mockImplementation(()=>new Promise(done=>{resolve=done;}));render(<UserList/>);
 expect(screen.getByText('Loading users...')).toBeTruthy();
 await act(async()=>resolve({data:users}));
 expect(screen.getByRole('heading',{name:'Leanne Graham'})).toBeTruthy();expect(screen.getByText('leanne@example.com')).toBeTruthy();expect(screen.getByText('Example Company')).toBeTruthy();
 expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users',expect.objectContaining({timeout:15000,signal:expect.any(AbortSignal)}));
});
test('searches names case-insensitively, shows no matches and clears search',async()=>{
 axios.get.mockResolvedValue({data:users});const user=userEvent.setup();render(<UserList/>);await screen.findByText('Leanne Graham');
 await user.type(screen.getByLabelText('Search users by name'),'LEANNE');expect(screen.queryByText('Ervin Howell')).toBeNull();
 await user.clear(screen.getByLabelText('Search users by name'));await user.type(screen.getByLabelText('Search users by name'),'missing');expect(screen.getByText('No matching users.')).toBeTruthy();
 await user.click(screen.getByRole('button',{name:'Clear search'}));expect(screen.getAllByRole('article')).toHaveLength(2);
});
test('expands and collapses user details with keyboard-accessible button',async()=>{
 axios.get.mockResolvedValue({data:users});const user=userEvent.setup();render(<UserList/>);await screen.findByText('Leanne Graham');
 const button=screen.getByRole('button',{name:/Leanne Graham/});expect(button.getAttribute('aria-expanded')).toBe('false');
 await user.click(button);expect(screen.getByText('Apt 1, Main Street, Lagos, 100001')).toBeTruthy();expect(screen.getByText('12345')).toBeTruthy();expect(screen.getByText('example.com')).toBeTruthy();
 await user.click(button);expect(screen.queryByText('12345')).toBeNull();
});
test('shows error and successfully retries',async()=>{
 axios.get.mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce({data:users});const user=userEvent.setup();render(<UserList/>);
 expect(await screen.findByRole('alert')).toBeTruthy();await user.click(screen.getByRole('button',{name:'Try again'}));expect(await screen.findByText('Leanne Graham')).toBeTruthy();
});
test('handles an empty API list',async()=>{axios.get.mockResolvedValue({data:[]});render(<UserList/>);expect(await screen.findByText('No users available.')).toBeTruthy();});
test('cancels the pending request on unmount',()=>{axios.get.mockImplementation(()=>new Promise(()=>{}));const {unmount}=render(<UserList/>);const signal=axios.get.mock.calls[0][1].signal;unmount();expect(signal.aborted).toBe(true);});
