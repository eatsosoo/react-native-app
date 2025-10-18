import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/theme";

interface CollapseProps {
  title: string;
  children: React.ReactNode;
  borderColor?: string;
  defaultExpanded?: boolean;
}

const Collapse: React.FC<CollapseProps> = ({
  title,
  children,
  borderColor,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState(0);
  const animation = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;
  const { theme } = useAppTheme();

  const toggle = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const onContentLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    if (height > 0 && height !== contentHeight) {
      setContentHeight(height);
    }
  };

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  return (
    <View style={[styles.container, {
      borderColor: borderColor || '#ccc',
      backgroundColor: theme.surface,
    }]}>
      <TouchableOpacity style={[styles.header]} onPress={toggle}>
        <Text style={[styles.title, { color: theme.primary }]}>{title}</Text>
        <Ionicons name={expanded ? 'caret-down-outline' : 'caret-up-outline'} size={14} style={[{color: theme.primary}]} />
      </TouchableOpacity>

      <Animated.View style={[styles.body, { height }]}>
        <View style={styles.content} onLayout={onContentLayout}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

export default Collapse;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
  },
  icon: {
    fontSize: 14,
  },
  body: {
    overflow: "hidden",
  },
  content: {
    padding: 12,
  },
});
