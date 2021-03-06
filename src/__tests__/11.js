import React from 'react'
import chalk from 'chalk'
import axiosMock from 'axios'
import {renderIntoDocument, render, cleanup, wait} from '../../test/utils'
import Usage from '../exercises-final/11'
// import Usage from '../exercises/11'

jest.mock('axios', () => {
  return jest.fn(() =>
    Promise.resolve({
      data: {data: {user: {company: 'Jimmy Johns'}}},
    }),
  )
})

afterEach(cleanup)

test('displays the user company', async () => {
  const {getByLabelText, getByText, getByTestId} = renderIntoDocument(<Usage />)
  getByLabelText('username').value = 'jeffry'
  getByText('submit').click()
  await wait(() =>
    expect(getByTestId('username-display')).toHaveTextContent('Jimmy Johns'),
  )
  expect(axiosMock).toHaveBeenCalledTimes(1)
  const gitHubRequest = {
    data: {
      query: expect.any(String),
    },
    headers: {
      Authorization: expect.any(String),
    },
    method: 'post',
    url: 'https://api.github.com/graphql',
  }
  expect(axiosMock).toHaveBeenCalledWith(gitHubRequest)
  expect(axiosMock.mock.calls[0][0].data.query).toMatch('jeffry')
  axiosMock.mockClear()

  axiosMock.mockImplementationOnce(() =>
    Promise.resolve({
      data: {data: {user: {company: 'McDonalds'}}},
    }),
  )
  getByLabelText('username').value = 'fred'
  getByText('submit').click()
  await wait(() =>
    expect(getByTestId('username-display')).toHaveTextContent('McDonalds'),
  )
  expect(axiosMock).toHaveBeenCalledTimes(1)
  expect(axiosMock).toHaveBeenCalledWith(gitHubRequest)
  expect(axiosMock.mock.calls[0][0].data.query).toMatch('fred')
  axiosMock.mockClear()

  getByText('submit').click()
  try {
    expect(axiosMock).not.toHaveBeenCalled()
  } catch (error) {
    error.message = [
      chalk.red(
        `🚨  Make certain that in your componentDidUpdate, you check whether the previous props username changed before making another request. 🚨`,
      ),
      error.message,
    ].join('\n')
    throw error
  }
})

//////// Elaboration & Feedback /////////
// When you've finished with the exercises:
// 1. Copy the URL below into your browser and fill out the form
// 2. remove the `.skip` from the test below
// 3. Change submitted from `false` to `true`
// 4. And you're all done!
/*
http://ws.kcd.im/?ws=learn%20react&e=11&em=
*/
test.skip('I submitted my elaboration and feedback', () => {
  const submitted = false // change this when you've submitted!
  expect(submitted).toBe(true)
})
////////////////////////////////
