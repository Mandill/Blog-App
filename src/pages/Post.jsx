import React, {useEffect, useState} from 'react'
import { Link, useNavigate, useParams} from "react-router-dom"

import appwriteService from "../appwrite/config"
import Button from "../components/Button"
import Container from "../components/container/Container"
import parse from "html-react-parser"
import {useSelector } from "react-redux"

function Post() {
  const [post, setPost] = useState(null)
  const {slug} = useParams()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData)
  const isAuthor = post && userData ? post.UserId === userData.$id : false

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          console.log(userData);
          setPost(post)
          console.log(post);
          console.log(isAuthor);
        }else {
          navigate("/")
        }
      })
    }
  }, [slug, navigate])

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate("/")
      }
    })
  }
  return post ? (
    <div className="py-8">
      <Container>
        <div className='w-full mb-4 relative border rounded-xl p-2'>
            <div className='mx-auto w-[500px]'>
            <img style={{ width: '400px', height: '400px' }}  src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title} className='rounded-xl' />
            { isAuthor && (
              <div className="absolute right-6 top-6">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button bgColor="bg-green-500" className="mr-3">Edit</Button>
                </Link>
                <Button bgColor="bg-red-500" 
                onClick={deletePost}
                >Delete</Button>
              </div>
            )}
         
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{post.Title}</h1>
              {post.Content && typeof post.Content === 'string' && (
                <div className="browser-css">
                  {parse(post.Content)}
                </div>
              )}
           </div>
            </div>
        </div>
      </Container>
    </div>
  ) : null
}

export default Post