"use client"

import React, { useCallback, useEffect, useState } from 'react'
import apiClient from '@/app/utils/apiClient'

type socialPlatform = 'youtube' | 'instagram' | 'tiktok'

interface socialLink {
  platform: socialPlatform
  url: string
}

interface socialMetaConfig {
  icon: string
  colorClass: string
}

const socialMeta: Record<socialPlatform, socialMetaConfig> = {
  youtube: { icon: 'icon-youtube', colorClass: 'si-youtube' },
  instagram: { icon: 'icon-instagram', colorClass: 'si-instagram' },
  tiktok: { icon: 'icon-tiktok', colorClass: 'si-tiktok' },
}

const platformOrder: socialPlatform[] = ['youtube', 'instagram', 'tiktok']

const SocialMedia = () => {
  const [links, setLinks] = useState<socialLink[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLinks = useCallback(async () => {
    try {
      const response = await apiClient.get('/social-media-links')
      const data = response.data.data

      if (Array.isArray(data)) {
        setLinks(data)
      }
    } catch (err) {
      console.error('Failed to fetch social media links:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  const orderedLinks = platformOrder
    .map((platform) => links.find((link) => link.platform === platform))
    .filter((link): link is socialLink => Boolean(link?.url))

  if (loading) return null

  if (orderedLinks.length === 0) return null

  return (
<div className="widget clearfix">
  <h4 className="mb-2 ls1 text-uppercase fw-bold">
    Ikuti Sosial Media Kami
    </h4>
  <div className="line line-xs line-market"></div>
  <div className="row center mt-4 clearfix">
    {orderedLinks.map((link) => {
      const meta = socialMeta[link.platform]

      return (
    <div className="col-4" key={link.platform}>
      <a href={link.url} target="_blank" rel="noopener noreferrer"
        className={`social-icon si-dark float-none m-auto si-colored ${meta.colorClass}`}>
        <i className={meta.icon}></i>
        <i className={meta.icon}></i>
      </a>
    </div>
      )
    })}
  </div>
</div>  )
}

export default SocialMedia
