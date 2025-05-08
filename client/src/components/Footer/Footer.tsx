import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <>
    <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">About Next Hire</h3>
              <p className="text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque id, fugiat quae dolores dolorem sapiente recusandae ipsa nulla ratione commodi?</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="text-gray-400 space-y-1">
                <li><Link to="#" className="hover:text-white">Home</Link></li>
                <li><Link to="#" className="hover:text-white">Features</Link></li>
                <li><Link to="#" className="hover:text-white">About</Link></li>
                <li><Link to="#" className="hover:text-white">Premium</Link></li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-lg font-semibold mb-2">Legal</h3>
              <ul className="text-gray-400 space-y-1">
                <li><Link to="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-white">Cookie Policy</Link></li>
                <li><Link to="#" className="hover:text-white">Content Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 Next Hire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer