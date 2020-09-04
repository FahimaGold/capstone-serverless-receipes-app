import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createReceipe, deleteReceipe, getReceipes, patchReceipe } from '../api/receipes-api'
import Auth from '../auth/Auth'
import { Receipe } from '../types/Receipe'

interface ReceipesProps {
  auth: Auth
  history: History
}

interface ReceipesState {
  receipes: Receipe[]
  newReceipeName: string
  loadingReceipes: boolean
}

export class Receipes extends React.PureComponent<ReceipesProps, ReceipesState> {
  state: ReceipesState = {
    receipes: [],
    newReceipeName: '',
    loadingReceipes: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReceipeName: event.target.value })
  }

  onEditButtonClick = (receipeId: string) => {
    this.props.history.push(`/receipes/${receipeId}/edit`)
  }

  onReceipeCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      //const dueDate = this.calculateDueDate()
      const newReceipe = await createReceipe(this.props.auth.getIdToken(), {
        name: this.state.newReceipeName,
        ingredients: ''
      })
      this.setState({
        receipes: [...this.state.receipes, newReceipe],
        newReceipeName: ''
      })
    } catch {
      alert('Receipe creation failed')
    }
  }

  onReceipeDelete = async (receipeId: string) => {
    try {
      await deleteReceipe(this.props.auth.getIdToken(), receipeId)
      this.setState({
        receipes: this.state.receipes.filter(receipe => receipe.receipeId != receipeId)
      })
    } catch {
      alert('Receipe deletion failed')
    }
  }

  onReceipeCheck = async (pos: number) => {
    try {
      const receipe = this.state.receipes[pos]
      await patchReceipe(this.props.auth.getIdToken(), receipe.receipeId, {
        name: receipe.name,
        ingredients: ''
      })
      this.setState({
        receipes: update(this.state.receipes, {
          [pos]: { ingredients: {$set: ''} }
        })
      })
    } catch {
      alert('Receipe patch failed')
    }
  }

  async componentDidMount() {
    try {
      const receipes = await getReceipes(this.props.auth.getIdToken())
      this.setState({
        receipes,
        loadingReceipes: false
      })
    } catch (e) {
      alert(`Failed to fetch receipes: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Receipes</Header>

        {this.renderCreateReceipeInput()}

        {this.renderReceipes()}
      </div>
    )
  }

  renderCreateReceipeInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Receipe',
              onClick: this.onReceipeCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderReceipes() {
    if (this.state.loadingReceipes) {
      return this.renderLoading()
    }

    return this.renderReceipesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Receipes
        </Loader>
      </Grid.Row>
    )
  }

  renderReceipesList() {
    return (
      <Grid padded>
        {this.state.receipes.map((receipe, pos) => {
          return (
            <Grid.Row key={receipe.receipeId}>
            
              <Grid.Column width={10} verticalAlign="middle">
                {receipe.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {receipe.ingredients}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(receipe.receipeId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onReceipeDelete(receipe.receipeId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {receipe.attachmentUrl && (
                <Image src={receipe.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
