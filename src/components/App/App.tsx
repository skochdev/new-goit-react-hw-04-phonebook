import React, { useEffect, useState } from 'react';
import * as S from './App.styled';
import { Box } from '../../utils/Box';
import { AddNewContact } from '../AddNewContact/AddNewContact';
import { ContactList } from '../ContactList/ContactList';
import { Filter } from '../Filter/Filter';
import { About } from '../About/About';

export type Contact = {
  fullName: string;
  phoneNumber: string;
  id: string;
};

export const App = () => {
  const [contacts, setContacts] = useState(() => {
    // reading from  local storage or setting the key
    return JSON.parse(localStorage.getItem('contacts')!) ?? ([] as Contact[]);
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      const parsedContacts = JSON.parse(storedContacts);
      setContacts(parsedContacts);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleAddNewContact = (newContact: Contact) => {
    const isDuplicate = checkForDuplicate(newContact.fullName);

    if (!isDuplicate) {
      setContacts((s: Contact[]) => [...s, newContact]);
      setFilter('');
    } else {
      alert(`${newContact.fullName} is already is your contact list`);
    }
  };

  const checkForDuplicate = (name: string) => {
    let normalizedNewName = name.toLowerCase();

    return contacts.some(
      (contact: Contact) => contact.fullName.toLowerCase() === normalizedNewName
    );
  };

  const handleFilter = (filterValue: string) => {
    setFilter(filterValue);
  };

  const handleDeleteContact = (id: string) => {
    setContacts((s: Contact[]) =>
      s.filter((contact: Contact) => contact.id !== id)
    );

    handleFilter('');
  };

  const getFilteredContacts = (contacts: Contact[]) => {
    return contacts.filter(
      (contact: Contact) =>
        contact?.fullName.toLowerCase().includes(filter.toLowerCase()) ||
        contact.phoneNumber.includes(filter)
    );
  };

  const filteredContacts = getFilteredContacts(contacts);

  return (
    <Box as="main" mx={4}>
      <Box as="section" my={5} maxWidth="600px" mx="auto">
        <Box as="h1" textAlign="center">
          Phonebook
        </Box>
        <AddNewContact onAddNewContact={handleAddNewContact} />
        <Box my={5} mx={4}>
          <Filter onFilterChange={handleFilter} filterValue={filter} />
        </Box>
        <Box my={5} textAlign="center">
          <ContactList
            contacts={filteredContacts}
            onDeleteContactClick={handleDeleteContact}
          />
        </Box>
        <S.About as={Box} mt={5}>
          <About />
        </S.About>
      </Box>
    </Box>
  );
};
