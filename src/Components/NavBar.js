function NavBar({ onChange }) {
  return (
    <div className="header">
      <div>
        <img className="logo" src="images/logo.png" alt="Logo" />
        <p>Everest Booking Site</p>
      </div>
      <nav>
        <ul>
          <li>
            <a href="#">The Everest Booking Site</a>
          </li>
        </ul>
      </nav>
      <form>
        <div className="SearchBar">
          <input
            type="text"
            placeholder="Enter Movie Name"
            className="inputText"
            onChange={onChange}
          />
          <button type="button">
            <i className="fa-brands fa-searchengin"></i>
          </button>
        </div>
      </form>
    </div>
  );
}

export default NavBar;
