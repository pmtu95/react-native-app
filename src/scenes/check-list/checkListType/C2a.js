import React from 'react';
import _ from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import {
    View,
    FlatList,
    Platform,
    Dimensions,
    PermissionsAndroid,
} from 'react-native';
import {
    StyleService,
    useStyleSheet,
    TopNavigation,
    TopNavigationAction,
    ListItem,
    Input,
    Text,
    Toggle,
    Select,
    SelectItem,
    Button,
    ButtonGroup,
    Icon,
    Tab,
    TabView,
    Spinner,
    CheckBox
} from '@ui-kitten/components';
export default function C2a(props) {
    const { details, styles, formData, setFormData, control } = props;
    const [newFormDatas, setNewFormData] = React.useState({
        MS: {
            Presence: 'Y',
            Correct: 'Y',
            Note: '',
            Checked: false
        },
        GE: {
            Presence: 'Y',
            Correct: 'Y',
            Note: '',
            Checked: false
        },
        Plugin: {
            Presence: 'Y',
            Correct: 'Y',
            Note: '',
            Checked: false
        }
    });
    React.useEffect(() => {
        setFormData(newFormDatas);
    }, []);
    return <>

        <View
            style={[
                styles.itemContainer,
                { flexDirection: 'row', justifyContent: 'space-between' },
            ]}>
            <Text style={styles.infoText}>Nhãn hiệu</Text>
            <Text style={styles.valueText}>
                {details.custom_attributes.brand || ''}
            </Text>
        </View>

        {Object.keys(newFormDatas).length ? <>
            {Object.keys(newFormDatas).map((_key, index) => {
                return <>
                    <View style={styles.itemContainer}>
                        <View style={styles.rowItem}>
                            <Text style={styles.infoText}>{_key}</Text>
                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => {
                                    return <>
                                        <CheckBox
                                            checked={value}
                                            onChange={() => {
                                                let newvalue = !value;
                                                let __newFormDatas = { ...newFormDatas };
                                                __newFormDatas[_key].Checked = newvalue;
                                                setNewFormData(__newFormDatas);
                                                setFormData(__newFormDatas);

                                                onChange(newvalue)
                                            }}
                                        >
                                        </CheckBox>
                                    </>
                                }}
                                name={_key + '.Checked'}
                                defaultValue={newFormDatas[_key].Checked}
                            />
                        </View>
                    </View>
                    {newFormDatas[_key].Checked ? <>
                        <View style={styles.itemContainer}>
                            <View style={styles.rowItem}>
                                <Text style={[styles.infoText, { marginBottom: 6 }]}>
                                    Hiện diện sản phẩm
                                </Text>
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <ButtonGroup size="small" status="basic">
                                            <Button
                                                style={
                                                    (value === 'Y') &&
                                                    styles.btnActive
                                                }
                                                onPress={() => {
                                                    onChange('Y');
                                                    let __newFormDatas = { ...newFormDatas };
                                                    __newFormDatas[_key].Presence = 'Y';
                                                    setNewFormData(__newFormDatas);
                                                    setFormData(__newFormDatas);
                                                }}
                                            >
                                                Y
                                            </Button>
                                            <Button
                                                style={
                                                    (value === 'N') &&
                                                    styles.btnActive
                                                }
                                                onPress={() => {
                                                    onChange('N');
                                                    let __newFormDatas = { ...newFormDatas };
                                                    __newFormDatas[_key].Presence = 'N';
                                                    setNewFormData(__newFormDatas);
                                                    setFormData(__newFormDatas);
                                                }}
                                            >
                                                N
                                            </Button>
                                        </ButtonGroup>
                                    )}
                                    name={_key + '.Presence'}
                                    defaultValue={newFormDatas[_key].Presence}
                                />
                            </View>
                        </View>
                        <View style={styles.itemContainer}>
                            <View style={styles.rowItem}>
                                <Text style={[styles.infoText, { marginBottom: 6 }]}>
                                    Có ít nhất 1 sản phẩm đúng
                                </Text>
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <ButtonGroup size="small" status="basic">
                                            <Button
                                                style={
                                                    (value === 'Y') &&
                                                    styles.btnActive
                                                }
                                                onPress={() => {
                                                    onChange('Y');
                                                    let __newFormDatas = { ...newFormDatas };
                                                    __newFormDatas[_key].Correct = 'Y';
                                                    setNewFormData(__newFormDatas);
                                                    setFormData(__newFormDatas);
                                                }}
                                            >
                                                Y
                                            </Button>
                                            <Button
                                                style={
                                                    (value === 'N') &&
                                                    styles.btnActive
                                                }
                                                onPress={() => {
                                                    onChange('N');
                                                    let __newFormDatas = { ...newFormDatas };
                                                    __newFormDatas[_key].Correct = 'N';
                                                    setNewFormData(__newFormDatas);
                                                    setFormData(__newFormDatas);
                                                }}
                                            >
                                                N
                                            </Button>
                                        </ButtonGroup>
                                    )}
                                    name={_key + '.Correct'}
                                    defaultValue={newFormDatas[_key].Correct}
                                />
                            </View>
                        </View>

                        <View style={styles.itemContainer}>
                            <Text style={[styles.infoText, { marginBottom: 6 }]}>
                                Ghi chú
                            </Text>
                            <Controller
                                control={control}
                                rules={{ required: false }}
                                render={({
                                    field: { onChange, value },
                                }) => (
                                    <>
                                        <Input
                                            value={value}
                                            onChangeText={(newvalue) => {
                                                onChange(newvalue);
                                                let __newFormDatas = { ...newFormDatas };
                                                __newFormDatas[_key].Note = newvalue;
                                                setNewFormData(__newFormDatas);
                                                setFormData(__newFormDatas);
                                            }}
                                            multiline
                                            numberOfLines={5}
                                            textAlignVertical="top"
                                            textStyle={{ minHeight: 100 }}
                                        />
                                    </>
                                )}
                                name={_key + '.Note'}
                                defaultValue={newFormDatas[_key].Note}
                            />
                        </View>

                    </> : null}
                </>
            })}
        </> : null}

    </>;
}