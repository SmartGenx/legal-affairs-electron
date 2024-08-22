import { Button } from '../../../ui/button'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import Header from './add-components/header'
import AddIssueForm from './add-components/addIssueForm'

export default function AddIssus() {
  return (
    <>
      <Header />
      <AddIssueForm />
    </>
  )
}
