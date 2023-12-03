import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {getAllPosts, createPost} from '../features/auth/postService';
import { addSubscription,removeSubscription } from '../features/auth/subscriptionService';
import { useState, useEffect } from 'react';
import { getAllTopics } from '../features/auth/topicService';
import { format } from 'date-fns';

function Dashboard() {

  const cookieUser = Cookies.get('user');
  const user = cookieUser ? JSON.parse(cookieUser):null;

  const cookieVisited = Cookies.get('visited-isat');
  const isVisited = cookieVisited ? JSON.parse(cookieVisited):null;

  const  [formData, setFormData] = useState({
      text: '',
      title: '',
      topic: '',
      isNewTopic: true,
      selectedTopic: ''
  });
  const [topicsData, setTopicsData] = useState(null)
  const [postsData, setPostsData] = useState(null)
  const [manageSubscription, setManageSubscription] = useState(false)
  const [isSubscriptionChanged, setIsSubscriptionChanged] = useState(false)

  const {text, title, topic, selectedTopic, isNewTopic} = formData;

  useEffect(()=>{
    if(user){
      getAlltopics();
      getPosts(user)
    } else {
      if(isVisited)
        navigate('/login')
      else 
        navigate('/register')
    }
    // eslint-disable-next-line
  }, [isSubscriptionChanged])

  const getAlltopics = async() => {
    try{
        const result = await getAllTopics(user);
        setTopicsData(result);
    } catch( error){
        throw new Error('Topics fetch failed.')
    }
}

  const navigate = useNavigate();

  const getPosts = async (user) => {
    const postsData = await getAllPosts(user);
    setPostsData(postsData)
  }

  const createNewPost = async () => {
    const post = {
      title: title,
      user: user._id,
      text: text,
      topic: isNewTopic? topic: selectedTopic,
      isNewTopic: isNewTopic
    }
    await createPost(post);
  }

  const onChangeText = (e) =>{
    setFormData((prevFormData) => ({
      ...prevFormData,
      text: e.target.value
    }));
  }
  const onChangeTitle = (e) =>{
    setFormData((prevFormData) => ({
      ...prevFormData,
      title: e.target.value
    }));
  }
  const onChangeTopic = (e) =>{
    setFormData((prevFormData) => ({
      ...prevFormData,
      topic: e.target.value,
      isNewTopic: true,
      selectedTopic: ''
    }));
  }

  const onSubmit = async () =>{
    await createNewPost();
  }

  const handleSelectTopic = async (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      topic: '',
      isNewTopic: false,
      selectedTopic: e.target.value
    }));
  }

  const toggleManageSubscription = () => {
    setManageSubscription(!manageSubscription)
  }

  const handleSubscribe = async (topic) => {
    const body = {
      user: user._id,
      topic: topic._id
    }
    if(topic.subscribed){
      await removeSubscription(body);
    }
    else {
      await addSubscription(body);
    }
    setIsSubscriptionChanged(!isSubscriptionChanged);
  }

  const isInputValid = (topic || selectedTopic) && title && text;

  if(!postsData){
    return <>No Posts Found!</>
  }

  return (
    <>
    
    <section className="form">
        <section className='form-section'>
            <form onSubmit={onSubmit}>
                <div className="form-group create-post-topic-group">
                  <div className='w-40'>
                    <input 
                        type="text" 
                        className="form-controls"
                        // style={inputStyle} 
                        id="newTopic" 
                        name='newTopic' 
                        value={topic} 
                        placeholder='Create a Topic' 
                        onChange={onChangeTopic}/>
                  </div>
                  <div className='w-10'>-OR-</div>
                  <div className='w-40'>
                    <select id="dynamicDropdown" value={selectedTopic} onChange={handleSelectTopic}>
                       <option value="">Select existing topic</option>
                            {topicsData && topicsData.map((item, index) => (
                              <option key={index} value={item._id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-controls"
                        id="title" 
                        name='title' 
                        value={title} 
                        placeholder='Write a title' 
                        onChange={onChangeTitle}/>
                </div>
                <div className="form-group">
                    <textarea 
                        // type="textarea" 
                        rows="3"
                        className="form-controls"
                        id="postText" 
                        name='postText' 
                        value={text} 
                        placeholder='Write your post here' 
                        onChange={onChangeText}/>
                </div>
                <div className='create-post-form'>
                    <button disabled={!isInputValid} type='submit' className='btn fr'>Create</button>
                </div>
            </form>
          </section>
          <section className='manage-subscription'>
          <div>
            <button type="button" onClick={toggleManageSubscription} className='custom-btn-link'>
              Manage Subscriptions &gt;&gt; {manageSubscription && <span className='subscription-message'>Click on topics below to subscribe/unsubscribe</span>}
            </button>
          </div>
          {manageSubscription && 
          <div className='subscription-topics-div'>
            {topicsData && topicsData.map((item, index) => (
                <span className={item.subscribed?'subscription-topics-subscribed':'subscription-topics'} key={index} onClick={()=>handleSubscribe(item)}>
                  <span className='pr-1'>{item.name}</span> 
                  {item.subscribed && <span>&#x2713;</span>}
                </span>        
            ))}
          </div>}
        </section>
        </section>
    {postsData && postsData.map((item, index) => (
      <div key={index}>
        <div className='post'>
          <div className='post-header'>
            <div className='post-title'>{item.title}</div>
            <div className='post-topic'>{item.topicName}</div>
            <div className='post-date'>Posted on: {format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm')}</div>
          </div>
          <div className='post-body'>
            <div className='post-text'>{item.text}</div></div>
        </div>
      </div>
    ))}
    </>
  )
}

export default Dashboard