import React, { useState, useEffect } from 'react'
import { Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { brandService } from '../../services/home.service'
import './BranchMenu.css'

const BranchMenu = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const currentBranch = searchParams.get('branch') || ''
  const [brands, setBrands] = useState([])

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await brandService.getAllBrands()
      const brandsData = response.data.map(brand => ({
        key: brand.id.toString(),
        label: brand.name
      }))
      setBrands([{ key: 'all', label: 'Tất cả sản phẩm' }, ...brandsData])
    } catch (error) {
      console.error('Error fetching brands:', error)
    }
  }

  const handleBrandClick = ({ key }) => {
    const params = new URLSearchParams(location.search)
    params.set('branch', key) 
    navigate(`/?${params.toString()}`)
  }

  const getSelectedKey = () => {
    return currentBranch
  }

  return (
    <div className="brands-filter">
      <Menu
        mode="horizontal"
        selectedKeys={[getSelectedKey()]}
        onClick={handleBrandClick}
        className="brands-list"
        items={brands}
      />
    </div>
  )
}

export default BranchMenu 