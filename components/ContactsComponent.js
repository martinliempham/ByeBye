import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  AsyncStorage,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { Contacts } from 'expo';
import { List, ListItem, Icon, SearchBar } from 'react-native-elements';

class ContactsComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      contacts: null,
      contactSearch: null,
      loading: false,
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      noData: false
      // selected: []
    };
  }

  componentDidMount() {
    this.showFirstContactAsync();
  }

  showFirstContactAsync = async () => {
    // Ask for permission to query contacts.
    const permission = await Expo.Permissions.askAsync(
      Expo.Permissions.CONTACTS
    );
    if (permission.status !== 'granted') {
      // Permission was denied...
      return;
    }
    const contacts = await Expo.Contacts.getContactsAsync({
      fields: [Expo.Contacts.PHONE_NUMBERS],
      pageSize: 1000,
      pageOffset: 0
    });
    const obj = [...contacts.data];
    const newContacts = obj.sort((a, b) => {
      let nameA = a.name;
      let nameB = b.name;
      if (nameA < nameB) return -1;
    });
    this.setState({
      contacts: newContacts
    });
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true
      },
      () => {
        this.showFirstContactAsync();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.showFirstContactAsync();
      }
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE'
          // marginLeft: '14%'
        }}
      />
    );
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Search"
        lightTheme
        round
        returnKeyType="go"
        // ref="search"
        textInputRef="searchText"
        onChangeText={this.handleSearch.bind(this)}
      />
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE'
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  saveContact = arg => {
    arg.map(item => {
      let contactChoice = item.digits;
      AsyncStorage.setItem('contactChoice', contactChoice);
    });
    this.props.navigation.navigate('MessageScreen');
  };

  handleSearch = text => {
    this.setState({ contactSearch: text });
  };

  // handleSearch = e => {
  //   let text = e.toLowerCase();
  //   let contacts = this.state.contacts;
  //   let filteredName = contacts.filter(contact => {
  //     return contact.firstName.toLowerCase().match(text);
  //   });
  //   if (Array.isArray(filteredName)) {
  //     this.setState({
  //       noData: false,
  //       contacts: filteredName
  //     });
  //   }
  // };

  render() {
    // const { toggle } = this.state;
    const alphContacts = this.state.contacts;
    const contactSearch = this.state.contactSearch;

    return (
      <View style={styles.GetContactsContainer}>
        {/* <TouchableOpacity onPress={this.showFirstContactAsync.bind(this)}>
          <Icon name="users" type="feather" color="#517fa4" raised={true} />
          <Text>Contacts</Text>
        </TouchableOpacity> */}
        {/* <Icon
          name="users"
          type="feather"
          color="#517fa4"
          raised={true}
          onPress={() => console.log(AsyncStorage.getItem('contactChoice'))}
        /> */}
        {alphContacts ? (
          <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
            <FlatList
              data={
                !contactSearch
                  ? alphContacts
                  : alphContacts.filter(item =>
                      item.firstName.includes(this.state.contactSearch)
                    )
              }
              // data={alphContacts}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => this.saveContact(item.phoneNumbers)}
                >
                  <ListItem
                    roundAvatar
                    title={item.name}
                    containerStyle={{ borderBottomWidth: 0 }}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index}
              ListHeaderComponent={this.renderHeader}
              ItemSeparatorComponent={this.renderSeparator}
              // ListFooterComponent={this.renderFooter}
              // refreshing={this.state.refreshing}
              // onEndReached={this.handleLoadMore}
              // onEndReachedThreshold={50}
            />
          </List>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Header: {
    backgroundColor: 'green'
  },
  GetContactsContainer: {
    flexDirection: 'column',
    flex: 1
    // backgroundColor: '#95dcf4',
    // justifyContent: 'flex-start',
    // padding: 8,
    // marginRight: 5,
    // marginLeft: 5,
    // marginBottom: 100,
    // borderRadius: 10
  },
  keyboard: {
    flex: 1,
    justifyContent: 'space-between'
  }
});

export default ContactsComponent;
