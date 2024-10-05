import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const deafaultImageurl = "https://i.pravatar.cc/48?";

  const [showAddFriend, setShowAddFriend] = useState(false);
  function onAddFriendClick() {
    setShowAddFriend(!showAddFriend);
  }

  const [name, setName] = useState("");
  function handleNameChange(e) {
    setName(e.target.value);
  }

  const [image, setImage] = useState(deafaultImageurl);
  function handleImageChange(e) {
    setImage(e.target.value);
  }

  const [friendList, setFriendList] = useState(initialFriends);
  const id = crypto.randomUUID();
  const imageurl = deafaultImageurl !== image ? image : deafaultImageurl + id;

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const friendObj = {
      id,
      name: name,
      image: imageurl,
      balance: 0,
    };
    setFriendList([...friendList, friendObj]);
    setName("");
    setImage(deafaultImageurl);
    onAddFriendClick();
  }

  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleSelectedFriend(friend) {
    console.log(friend);
    //setSelectedFriend(friend);
    setSelectedFriend((selected) =>
      selected && selected.id === friend.id ? null : friend
    );
  }

  const [bill, setBill] = useState(0);
  function handleBill(e) {
    setBill(e.target.value);
    setMyBill(e.target.value);
  }

  const [mybill, setMyBill] = useState(0);
  const [friendsBill, setFriendsBill] = useState(0);
  function handleMyBill(e) {
    setMyBill(Math.min(+e.target.value, bill));
    setFriendsBill(bill - Math.min(+e.target.value, bill));
  }

  const [payer, setPayer] = useState("user");
  function handlePayer(e) {
    setPayer(e.target.value);
  }

  const [payerObj, setPayerObj] = useState(null);
  function handlePayerObj(e, friendId) {
    e.preventDefault();
    if (mybill === 0 && friendsBill === 0) return;
    console.log(friendId);
    const ipaid = payer === "user" ? true : false;
    const amount = payer === "user" ? friendsBill : mybill;
    setFriendList((prevList) =>
      prevList.map((friend) =>
        friend.id === friendId
          ? {
              ...friend,
              balance: ipaid
                ? friend.balance + amount
                : friend.balance - amount,
            }
          : friend
      )
    );
    setBill(0);
    setMyBill(0);
    setFriendsBill(0);
    setPayer("user");
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friendList={friendList}
          selectedFriend={selectedFriend}
          onSelectedFriend={handleSelectedFriend}
        />
        {showAddFriend && (
          <FormAddFriend
            name={name}
            onNameChange={handleNameChange}
            image={image}
            onImageChange={handleImageChange}
            onFormSubmit={handleSubmit}
          />
        )}
        <Button onAddFriendClick={onAddFriendClick}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          bill={bill}
          handleBill={handleBill}
          mybill={mybill}
          handleMyBill={handleMyBill}
          friendsBill={friendsBill}
          payer={payer}
          handlePayer={handlePayer}
          payerObj={payerObj}
          handlePayerObj={handlePayerObj}
        />
      )}
    </div>
  );
}

function FriendList({ friendList, selectedFriend, onSelectedFriend }) {
  const friends = friendList;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          selectedFriend={selectedFriend}
          key={friend.id}
          onSelectedFriend={onSelectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selectedFriend, onSelectedFriend }) {
  return (
    <li
      className={
        selectedFriend && selectedFriend.id === friend.id ? "selected" : ""
      }
    >
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even!</p>}
      <Button selectedFriend={friend} onSelectedFriend={onSelectedFriend}>
        {selectedFriend && selectedFriend.id === friend.id ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({
  children,
  selectedFriend,
  onSelectedFriend,
  onAddFriendClick,
}) {
  return (
    <button
      className="button"
      onClick={
        selectedFriend
          ? () => onSelectedFriend(selectedFriend)
          : onAddFriendClick
      }
    >
      {children}
    </button>
  );
}

function FormAddFriend({
  name,
  onNameChange,
  image,
  onImageChange,
  onFormSubmit,
}) {
  return (
    <form className="form-add-friend" onSubmit={onFormSubmit}>
      <label>~ Friend name</label>
      <input type="text" value={name} onChange={onNameChange} />

      <label>~ Image URL</label>
      <input type="text" value={image} onChange={onImageChange}></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({
  selectedFriend,
  bill,
  handleBill,
  mybill,
  handleMyBill,
  friendsBill,
  payer,
  handlePayer,
  handlePayerObj,
}) {
  return (
    <form
      className="form-split-bill"
      onSubmit={(e) => handlePayerObj(e, selectedFriend.id)}
    >
      <h2>
        Split a bll with {selectedFriend ? `${selectedFriend.name}` : "X"}
      </h2>
      <label>~ Bill value</label>
      <input type="text" value={bill} onChange={handleBill} />
      <label>~ Your expense</label>
      <input
        type="text"
        value={mybill}
        disabled={+bill === 0}
        onChange={handleMyBill}
      />
      <label>
        ~ {selectedFriend ? `${selectedFriend.name}` : "X"}'s expense
      </label>
      <input type="text" value={friendsBill} disabled />
      <label>~ Who is paying the bill</label>
      <select onChange={handlePayer}>
        <option value={payer}>You</option>
        <option value="friend">
          {selectedFriend ? `${selectedFriend.name}` : "X"}
        </option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
