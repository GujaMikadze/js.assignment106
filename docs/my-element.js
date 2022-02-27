import {LitElement, html, css} from 'lit';
import {check, saveToStorage, loadFromStorage, clearStorage} from './api/rand';

export class MyElement extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
      }
      .container {
        width: 100%;
        display: grid;
        padding: 84px;
        gap: 52px;
        grid-template-columns: 1fr 3fr 1fr;
      }
      
      .container > .left,
      .container > .right {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid rgb(223, 223, 223);
        box-shadow: rgb(0 0 0 / 20%) 0px 0px 12px;
        border-radius: 12px;
        padding: 12px;
      }

      .container > .middle {
        display: flex;
        flex-direction: column;
      }
      
      .left {
        display: grid;
        grid-gap: 24px;
      }
      
      .left > span {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }
      
      .tweet {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-bottom: 20px;
        border-bottom: 1px solid rgb(223, 223, 223);
        box-shadow: rgb(0 0 0 / 20%) 0px 0px 12px;
        border-radius: 12px;
        padding: 12px;
      }
      
      .title {
        font-size: 16px;
        font-weight: 700;
        color: #00acee;
      }
      
      .post {
        font-size: 18px;
        color: #000;
        margin-top: 10px;
        padding: 10px;
        border: 1px solid;
        margin-bottom: 10px;
      }

      .error-messege {
        height: 0;
        overflow:  hidden;
        font-size: 14px;
      }

      .is-visible {
        height: auto;
      }

      #btnSpan {
        justify-content: center;
      }
      
      button {
        color: #fff;
        font-weight: 700;
        background-color: #00acee;
        border-radius: 8px;
        border: none;
        width: 100px;
        height: 30px;
        cursor: pointer;
      }

      button:hover {
        background-color: #136889;
      }
    `;
  }
  
  get invalidMessege() {
    return this.renderRoot?.querySelector('#invalidMessege') ?? null;
  }

  render() {
    return html`
      <div class='container'>
        <div class='left'>
          <span>          Name:
          <input @input="${this.nameInput}">
          </span>
          <span>
          Post:
          <textarea @input='${this.postInput}'></textarea>
          </span>
          <span class="error-messege" id="invalidMessege">
            შეავსეთ ორივე ველი
          </span>
          <span id="btnSpan">
          <button @click='${this.postTweet}'>Tweet</button>
          </span>
        </div>
        <div class='middle'>
          ${this.tweets.map((item, index)=> html`
            <div class='tweet'>
              <div class='title'>${item.name}</div>
              <div class='post'>${item.post}</div>
              <span style='color: red; cursor: pointer' @click='${()=> this.DeleteTweet(index)}'>Delete</span>
            </div>
          `)}
        </div>
        <div class='right'>
          Posted <span style='font-weight: bold'>${this.postCount || 0}</span> tweet
          <span style='color: red; cursor: pointer' @click='${()=> this.DeleteAll()}'>Delete All</span>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      tweets: {
        type: Array,
      },
      postCount: {
        type: Number,
      }
    };
  }

  constructor() {
    super();
    this.tweets = [...loadFromStorage()];
    this.postCount = this.tweets.length;
  }

  nameInput(event){
    const value = event.target.value;
    this.name = value;
  }

  postInput(event){
    const value = event.target.value;
    this.post = value;
  }

  DeleteAll() {
    this.tweets = [];
    saveToStorage(this.tweets);
    this.postCount = this.tweets.length;
  }

  postTweet(){
    if(this.name && this.post) {
      this.tweets = [...this.tweets, {name: this.name, post: this.post}];
      this.postCount = this.tweets.length;
      saveToStorage(this.tweets.reverse());
      this.invalidMessege.classList.remove("is-visible");
    } else {
      this.invalidMessege.classList.add("is-visible");
    }
  }

  DeleteTweet(index){
    check()
      .then((response) => {
        {
          this.tweets.splice(index, 1);
          this.postCount = this.tweets.length;
          this.tweets = [...this.tweets];
          saveToStorage(this.tweets);
        }
      })
      .catch((error) => alert('Try Again Later'));
  }

}

window.customElements.define('my-element', MyElement);
