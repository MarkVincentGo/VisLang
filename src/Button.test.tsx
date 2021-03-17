import React from 'react';
import { render, fireEvent, act, waitForElement } from '@testing-library/react';
import { Button, ButtonContainer } from './Button';

describe('The Button Container Component', () => {
  it('renders children correctly', async () => {
    const { container } = render(<ButtonContainer>
      <span/>
      <span/>
      <span/>
    </ButtonContainer>);
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(3)
  });
});

describe('The Button Container Component', () => {
  it('renders name correctly', () => {
    const { container } = render(<Button name="test name"/>);
    const name = container.querySelector('.wrapper');
    expect(name).toBeInTheDocument();
    expect(name?.textContent).toBe('test name')
  });

  it('changes color on hover', async () => {
    const { container } = render(<Button name="test name"/>);
    let wrapper = container.querySelector('.wrapper') as Element;
    expect(wrapper).toHaveStyle('color: rgb(119, 119, 119)')
    await act(async () =>
    {
      fireEvent.mouseEnter(wrapper);
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    wrapper = container.querySelector('.wrapper') as Element;
    expect(wrapper).toHaveStyle('color: black')

    await act(async () =>
    {
      fireEvent.mouseLeave(wrapper);
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    wrapper = container.querySelector('.wrapper') as Element;
    expect(wrapper).toHaveStyle('color: rgb(119, 119, 119)')
  })

  it('renders dropdown options correctly', async () => {
    const mockDDFn = jest.fn();
    const { container } = render(<Button
      name="test name"
      dropDown
      ddClick={mockDDFn}
      dropDownList={['One', 'Two']}/>);

    let wrapper = container.querySelector('.wrapper') as Element;
    expect(wrapper).toHaveStyle('color: rgb(119, 119, 119)')
    await act(async () =>
    {
      fireEvent.mouseEnter(wrapper);
      await new Promise(resolve => setTimeout(resolve, 0))

      fireEvent.click(wrapper);
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    const dropdowns = container.querySelectorAll('.dropDownOption');
    expect(dropdowns.length).toBe(2);
    expect(dropdowns[0].textContent).toBe('One');
    expect(dropdowns[1].textContent).toBe('Two');

    await act(async () =>
    {
      fireEvent.click(dropdowns[0]);
      await new Promise(resolve => setTimeout(resolve, 0));
    })
    expect(mockDDFn).toBeCalled()
    
  });
})


