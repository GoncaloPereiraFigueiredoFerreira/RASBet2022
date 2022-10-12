import {Link ,Form} from 'react-router-dom'

export default function Login() {
  return (
    <p>
    <Link to='home'>Login</Link>
    <h1 />
    <Link to='register'>Register</Link>
    

    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue="ola"
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue="ola"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue="ola"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue="ola"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue="ola"
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onclick={()=>{;}}>Cancel</button>
      </p>
    </Form>
    </p>
  );
}