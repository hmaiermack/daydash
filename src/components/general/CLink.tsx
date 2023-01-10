import Link from 'next/link'
import React, { forwardRef, ReactNode } from 'react'
// custom link component to fix weirdness with nextjs Link component

interface Props {
    children?: ReactNode;
    href: string;
  }
type Ref = HTMLAnchorElement;
  
/* eslint-disable */
const CLink = forwardRef<Ref, Props>((props, ref) => {
    let { href, children, ...rest } = props
    return (
      <Link href={href}>
        <a ref={ref} {...rest}>
          {children}
        </a>
      </Link>
    )
  })
  

export default CLink