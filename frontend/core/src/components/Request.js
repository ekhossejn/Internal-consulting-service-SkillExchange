import React from 'react'
import {Card} from "react-bootstrap"

function Request({request}) {
  return (
<Card className='my-3 p-3 rounded'>
<Card.Body>
<Card.Title as="h3">
                {request.name}
            </Card.Title>
</Card.Body>
</Card>
  )
}

export default Request
