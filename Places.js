import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, View } from 'react-native';
import { Icon, Input, Button, ListItem } from 'react-native-elements';
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

export default function Places({ navigation }) {

    const [address, setAddress] = useState('');
    const [addresses, setAddresses] = useState([]);
    const db = SQLite.openDatabase('addressdb.db');

    const saveAddress = () => {
        db.transaction(tx => {
            tx.executeSql('insert into address (address) values (?)', [address]);
        }, null, updateList)
    }

    const updateList = () => {
        db.transaction(tx => {
            tx.executeSql('select * from address', [], (_, { rows }) =>
                setAddresses(rows._array)
            );
        }, null, null);
    }

    const deleteAddress = (id) => {
        db.transaction(
            tx => {
                tx.executeSql(`delete from address where id = ?;`, [id]);
            }, null, updateList
        )
    }

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('create table if not exists address (id integer primary key not null, address text);');
        }, null, updateList)
    }, []);

    readData = async () => {
        try {
            let value = await AsyncStorage.getItem('address');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <Input
                placeholder='Enter address (e.g. Mannerheimintie 1 Helsinki)'
                leftIcon={{ type: 'font-awesome', name: 'address-card' }}
                onChangeText={(address) => setAddress(address)}
                value={address}
            />
            <Button
                icon={<Icon name='save' color='#ffffff' />}
                buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                title='SAVE ADDRESS'
                onPress={saveAddress}
            />
            <FlatList
                style={styles.list}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) =>
                    <ListItem bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title
                                onPress={() => navigation.navigate('Map', { address: item.address })}
                                onLongPress={() => deleteAddress(item.id)}>
                                {item.address}
                            </ListItem.Title>
                        </ListItem.Content>
                        <Button
                            onPress={() => navigation.navigate('Map', { address: item.address })}
                            type="clear"
                            icon={<Icon name='map' color='#000000' />}
                        />
                    </ListItem>
                }
                data={addresses}
            />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        width: '100%',
    },
});
