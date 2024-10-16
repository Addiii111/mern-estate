import React, { useEffect, useState } from 'react'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { app } from '../firebase'
import axios from 'axios'
import {useSelector} from 'react-redux'
import { useNavigate , useParams} from 'react-router-dom'

export default function CreateListing() {
  const {currentUser} = useSelector(state => state.user)
  const navigate = useNavigate()
  const params = useParams()
  const [files, setFile] = useState([])
  const [formData, setFormData] = useState({
    imageUrls: [],
    name:'',
    description:'',
    address:'',
    type:'rent',
    bedrooms:1,
    bathrooms:1,
    regularPrice:50,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false,


  })
  const [imageUploadError, setImageUploadError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)


    useEffect(() => {

        const fetchListing = async () => {
            const listingId = params.listingId
            await axios.get(import.meta.env.VITE_BASE_URL+`/api/getListing/${listingId}`).then((res) => {
                setFormData(res.data)
              }).catch((err) => {
                console.log(err);
              })
        }

        fetchListing()

    },[])


  const handelImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true)
      setImageUploadError(false)
      const promises = []

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]))
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          })
          setImageUploadError(false)
          setUploading(false)
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)')
          setUploading(false)
        })
    } else {
      setImageUploadError('You can only upload 6 images per listing')
      setUploading(false)
    }
  }

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done `)
        },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        }
      )
    })
  }

  const handelRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    })
  }

  const handelChange = (e) => {
    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData({
        ...formData,
        type:e.target.id
      })
    }

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      })
    }

    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }

  }

  const handelSubmit = async (e) =>{
      e.preventDefault();

      try {
        if(formData.imageUrls.length < 1) return setError('You must upload at least one image')
        if(+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than Regular price')
        setLoading(true)
        setError(false)

        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }

        await axios.post(import.meta.env.VITE_BASE_URL+`/api/updateListing/${params.listingId}` ,JSON.stringify({
          ...formData,
          userRef: currentUser.data._id
        }), config).then((res) =>{
          setLoading(false)
          // console.log(res.data._id);
          navigate(`/listing/${res.data._id}`)
        })
        
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
  }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Update a listing
      </h1>
      <form onSubmit={handelSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handelChange}
            value={formData.name}
          />

          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handelChange}
            value={formData.description}
          />

          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handelChange}
            value={formData.address}
          />

          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2 '>
              <input type='checkbox' id='sale' className='w-5' onChange={handelChange}
               checked ={formData.type ==='sale'} />
              <span>Sell</span>
            </div>

            <div className='flex gap-2 '>
              <input type='checkbox' id='rent' className='w-5' onChange={handelChange} 
              checked = {formData.type ==='rent'} />
              <span>Rent</span>
            </div>

            <div className='flex gap-2 '>
              <input type='checkbox' id='parking' className='w-5' onChange={handelChange}
              checked = {formData.parking}
              />
              <span>Parking spot</span>
            </div>

            <div className='flex gap-2 '>
              <input type='checkbox' id='furnished' className='w-5' onChange={handelChange}
              checked = {formData.furnished}
              />
              <span>Furnished</span>
            </div>

            <div className='flex gap-2 '>
              <input type='checkbox' id='offer' className='w-5' onChange={handelChange}
              checked = {formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handelChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>

            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handelChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>

            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handelChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>

            {formData.offer && (


            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='discountPrice'
                min='0'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handelChange}
                value={formData.discountPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Discounted price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>

            )}
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className='flex gap-4'>
            <input
              onChange={(e) => setFile(e.target.files)}
              type='file'
              id='images'
              accept='image/*'
              multiple
              className='p-3 border border-gray-300 rounded w-full'
            />

            <button
              type='button'
              disabled={uploading}
              onClick={handelImageSubmit}
              className='p-3 text-green-700 border
             border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((urls, index) => (
              <div
                key={urls}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={urls}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button 
                  type='button'
                  onClick={() => handelRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}

          <button disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg
        uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Updating...':'Update Listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p> }
        </div>
      </form>
    </main>
  )
}
