/* eslint-disable jsx-a11y/label-has-associated-control */
import Loader from '@components/common-layout/loader/loader';
import { sellItemService } from '@services/sell-item.service';
import getConfig from 'next/config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';




function Blogs() {
    const {id} = useRouter().query;
    // const { publicRuntimeConfig: config } = getConfig();
    const [blogPosts, setBlogPosts] = useState(null);  
    const fetchAllBlogs = async () => {
        try {
          const blogs = await sellItemService.getBlogById(id);
          setBlogPosts(blogs.data); // Assuming `blogs` is an array, otherwise adjust accordingly
        } catch (error) {
          console.error('Error fetching blog posts:', error);
        }
      }
    
      useEffect(() => {
        fetchAllBlogs();
      }, []);
  
    return (
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'start', position: 'relative' }} className='m-4'>
        <Link href={`/blogs/allblogs/${blogPosts?.userId}`} style={{position: 'absolute', color: '#FF337C', top: '3vw', left: '3vw', border: '1px solid #FF337C', padding: '0.7vw', borderRadius: '5px'}}>
        Go Back
        </Link>
        {!blogPosts ?  (
           <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }} className="w-full"> <Loader containerStyle="text-center" size="40px" /></div>
          ): (
            <>
            <img style={{width: '50vw', height: '20vw', objectFit: 'cover', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'}} src={blogPosts?.media.thumbUrl || 'https://www.google.com/imgres?q=blogs%20default%20image&imgurl=https%3A%2F%2Fenviragallery.com%2Fwp-content%2Fuploads%2F2024%2F03%2FHow-To-Add-Post-Thumbnails-Set-a-Default-Featured-Image-in-WordPress-1-1.png&imgrefurl=https%3A%2F%2Fenviragallery.com%2Fhow-to-set-a-default-featured-image-in-wordpress%2F&docid=6tfspqrjYn3P7M&tbnid=V0dSXMI6bRCrMM&vet=12ahUKEwimi-v9zLeHAxUGhf0HHZA5D74QM3oECBwQAA..i&w=1240&h=600&hcb=2&ved=2ahUKEwimi-v9zLeHAxUGhf0HHZA5D74QM3oECBwQAA'} alt="" className='w-full' />
            <p className='' style={{width: '100%', maxWidth: '50vw', marginTop: '2vw'}}>{blogPosts?.description}</p>
            </>
          )}
      </div>
    );
  }

  export default Blogs;
