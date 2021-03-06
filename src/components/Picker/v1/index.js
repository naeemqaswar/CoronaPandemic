import React, {useEffect} from 'react'
import { View, Text, Modal, Image, StyleSheet, ScrollView, FlatList, SafeAreaView, TouchableWithoutFeedback } from 'react-native'

import { Ionicons } from '@expo/vector-icons';

import styles from './style';

const ITEM_HEIGHT = 47;
const ITEM_SEPARATOR_HEIGHT = 1;

const PickerV1 = (props) => {
    let listRef;

    const {display, close, options, selected = 0, onSelection, mainColor} = props;

    useEffect(()=>{

        // Scrolling to selected Region by index
        if(listRef && display === true && selected > 0){

            setTimeout(() => listRef.scrollToIndex({
                index: selected,
                viewPosition: 0
            }), 1);
        }
        
    }, [display]);

    const pickerItem = ({index, item}) => {
        const {code, name, flag} = item;

        let _itemSelected = index === selected;
        let _countryCode = getCountryCode(item);

        const _itemStyles = [styles.pickerItem, styles.pickerItemSelected, {height: ITEM_HEIGHT}];
        if(_itemSelected) _itemStyles.push(styles.pickerItemSelected);

        const _itemTextStyles = [styles.pickerItemText];
        // if(_itemSelected) _itemTextStyles.push({color: mainColor});

        const _itemTextWrapperStyles = [styles.pickerItemTextWrapper];
        if(_itemSelected) _itemTextWrapperStyles.push({width: '76%'});

        let _itemName = <View style={_itemTextWrapperStyles}>
            <Text style={_itemTextStyles} numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
        </View>;
        let _flagImage = flag ? <View style={styles.pickerItemImageWrapper}>
                <Image style={styles.pickerItemImage} source={{uri: flag}} />
            </View> : null;

        return <TouchableWithoutFeedback key={_countryCode} onPress={() => onSelection(_countryCode)}>
            <View style={{flex: 1}}>
                <View style={_itemStyles}>
                    {_flagImage}{_itemName}
                    { _itemSelected ? <View style={styles.pickerItemSelectedIcon}>
                            <Ionicons name="md-checkmark" size={28} color={mainColor} />
                        </View> : null
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>
    };

    const getCountryCode = ({code, name}) => code ? code: name;

    const renderListing = () => {

        return <SafeAreaView style={styles.pickerContent}>
            <FlatList
                ref={ ref => listRef = ref }
                persistentScrollbar={true}
                data={options}
                renderItem={ item => pickerItem(item)}
                keyExtractor={getCountryCode}
                ItemSeparatorComponent={()=> <View style={[styles.pickerItemSeparator, {height: ITEM_SEPARATOR_HEIGHT}]}></View>}
                getItemLayout={(data, index) => ({length: ITEM_HEIGHT, offset: (ITEM_HEIGHT + ITEM_SEPARATOR_HEIGHT) * index, index})}
            />
        </SafeAreaView>
    }

    const renderContent = () => {

        return <View style={styles.picker}>
            <TouchableWithoutFeedback onPress={close}><View style={styles.pickerOverlay}></View></TouchableWithoutFeedback>
            <View style={styles.pickerWrapper}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerHeaderText}>Select your Region</Text>
                </View>
                {renderListing()}
                <View style={styles.pickerFooter}>
                    <TouchableWithoutFeedback onPress={close}>
                        <View style={[styles.cancelButton, {backgroundColor: mainColor}]}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </View>;
    }
 
    return <Modal
			animationType="fade"
			transparent={true}
			visible={display}
			onRequestClose={() => {}}
		>
			{ renderContent() }
		</Modal>
}

export default Picker;