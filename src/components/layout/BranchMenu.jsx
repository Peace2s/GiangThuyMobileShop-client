import React from 'react'
import { Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import './BranchMenu.css'

const BranchMenu = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const currentBranch = searchParams.get('branch') || ''

  const brands = [
    { key: 'all', label: 'Tất cả sản phẩm' },
    { key: 'apple', label: 'Apple' },
    { key: 'samsung', label: 'Samsung' },
    { key: 'xiaomi', label: 'Xiaomi' },
    { key: 'oppo', label: 'Oppo' },
    { key: 'oneplus', label: 'OnePlus' },
  ]

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