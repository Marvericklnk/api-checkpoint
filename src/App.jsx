import UserList from './UserList.jsx';
import './index.css';
export default function App() {
  return <main><header><a className="brand" href="./">MARVIN<span> / PEOPLE</span></a><span className="header-note">THE USER DIRECTORY</span></header><section className="intro"><p className="eyebrow">A LITTLE MORE ABOUT EVERYONE.</p><h1>Meet the people.<br/><em>Find the details.</em></h1><p>Browse the directory, search a name, and open a card to learn more.</p></section><UserList/><footer>Sample user data from JSONPlaceholder · Built with React & Axios</footer></main>;
}
